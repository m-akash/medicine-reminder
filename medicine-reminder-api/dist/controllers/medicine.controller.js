"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.toggleReminderStatus = exports.getReminderStatus = exports.createRemindersForExistingMedicines = exports.createReminder = exports.refillMedicine = exports.getRefillReminders = exports.getMedicineTakenHistory = exports.setMedicineTakenDay = exports.getMedicineTakenDay = exports.deleteMedicine = exports.updateMedicine = exports.createMedicine = exports.getMedicineById = exports.getMedicineByEmail = void 0;
const db_config_1 = __importDefault(require("../config/db.config"));
const date_fns_1 = require("date-fns");
const createLocalDateTime = (dateStr, timeStr) => {
    console.log("Creating local date time with:", { dateStr, timeStr });
    if (!dateStr || !timeStr) {
        console.error("Invalid date or time string:", { dateStr, timeStr });
        throw new Error("Invalid date or time string");
    }
    const [year, month, day] = dateStr.split("-").map(Number);
    const [hour, minute] = timeStr.split(":").map(Number);
    console.log("Parsed values:", { year, month, day, hour, minute });
    if (isNaN(year) ||
        isNaN(month) ||
        isNaN(day) ||
        isNaN(hour) ||
        isNaN(minute)) {
        console.error("Invalid numeric values:", {
            year,
            month,
            day,
            hour,
            minute,
        });
        throw new Error("Invalid numeric values for date/time");
    }
    const date = new Date(year, month - 1, day, hour, minute, 0, 0);
    if (isNaN(date.getTime())) {
        console.error("Invalid date created:", date);
        throw new Error("Invalid date created");
    }
    console.log("Created date:", date);
    return date;
};
const getMedicineByEmail = async (req, res) => {
    try {
        const findMedicine = await db_config_1.default.medicine.findMany({
            where: { userEmail: req.params.userEmail },
        });
        if (findMedicine.length === 0) {
            return res
                .status(404)
                .json({ status: 404, message: "Your medicine list is empty now!" });
        }
        return res.status(200).json({
            status: 200,
            message: "Medicine find successfully!",
            findMedicine,
        });
    }
    catch (error) {
        return res
            .status(500)
            .json({ status: 500, message: "Internal server error", error });
    }
};
exports.getMedicineByEmail = getMedicineByEmail;
const getMedicineById = async (req, res) => {
    try {
        const findMedi = await db_config_1.default.medicine.findUnique({
            where: { id: req.params.id },
            include: {
                reminders: {
                    include: {
                        times: true,
                    },
                },
            },
        });
        if (!findMedi) {
            return res
                .status(404)
                .json({ status: 404, message: "Medicine not found!" });
        }
        return res.status(200).json({
            status: 200,
            message: "Medicine find successfully!",
            findMedi,
        });
    }
    catch (error) {
        return res
            .status(500)
            .json({ status: 500, message: "Internal server error", error });
    }
};
exports.getMedicineById = getMedicineById;
const createMedicine = async (req, res) => {
    try {
        const dateOnly = new Date(req.body.startDate);
        const scheduledTimes = req.body.scheduledTimes || [];
        const mainScheduledTime = scheduledTimes.length > 0
            ? createLocalDateTime(req.body.startDate, scheduledTimes[0])
            : dateOnly;
        const newMedicine = await db_config_1.default.medicine.create({
            data: {
                userEmail: req.body.userEmail,
                name: req.body.name,
                dosage: req.body.dosage,
                frequency: req.body.frequency,
                startDate: dateOnly,
                durationDays: req.body.durationDays,
                originalDurationDays: req.body.originalDurationDays,
                instructions: req.body.instructions,
                totalPills: req.body.totalPills,
                originalTotalPills: req.body.originalTotalPills,
                pillsPerDose: req.body.pillsPerDose,
                dosesPerDay: req.body.dosesPerDay,
                scheduledTime: mainScheduledTime,
                taken: false,
                reminders: {
                    create: {
                        repeatEveryDay: true,
                        isActive: true,
                        times: {
                            create: scheduledTimes.map((time) => ({
                                time: createLocalDateTime(req.body.startDate, time),
                            })),
                        },
                    },
                },
            },
            include: {
                reminders: {
                    include: {
                        times: true,
                    },
                },
            },
        });
        return res.status(201).json({
            status: 201,
            message: "Medicine created successfully",
            newMedicine,
        });
    }
    catch (error) {
        return res
            .status(500)
            .json({ status: 500, message: "Internal server error", error });
    }
};
exports.createMedicine = createMedicine;
const updateMedicine = async (req, res) => {
    try {
        console.log("Update medicine request body:", req.body);
        console.log("Medicine ID:", req.params.id);
        const existingMedicine = await db_config_1.default.medicine.findUnique({
            where: { id: req.params.id },
        });
        if (!existingMedicine) {
            console.log("Medicine not found:", req.params.id);
            return res.status(404).json({
                status: 404,
                message: "Medicine not found",
            });
        }
        console.log("Found existing medicine:", existingMedicine);
        const dateOnly = req.body.startDate
            ? new Date(req.body.startDate)
            : undefined;
        const scheduledTimes = req.body.scheduledTimes || [];
        const dateString = req.body.startDate
            ? new Date(req.body.startDate).toISOString().split("T")[0]
            : new Date().toISOString().split("T")[0];
        const mainScheduledTime = scheduledTimes.length > 0
            ? createLocalDateTime(dateString, scheduledTimes[0])
            : undefined;
        const updateData = {
            name: req.body.name,
            dosage: req.body.dosage,
            frequency: req.body.frequency,
            startDate: dateOnly,
            durationDays: req.body.durationDays,
            originalDurationDays: req.body.originalDurationDays,
            instructions: req.body.instructions,
            totalPills: req.body.totalPills,
            originalTotalPills: req.body.originalTotalPills,
            pillsPerDose: req.body.pillsPerDose,
            dosesPerDay: req.body.dosesPerDay,
        };
        // Only include fields that are not undefined or null
        Object.keys(updateData).forEach((key) => (updateData[key] === undefined || updateData[key] === null) &&
            delete updateData[key]);
        if (dateOnly)
            updateData.startDate = dateOnly;
        if (mainScheduledTime)
            updateData.scheduledTime = mainScheduledTime;
        if (typeof req.body.taken !== "undefined") {
            updateData.taken = req.body.taken;
        }
        console.log("Update data:", updateData);
        const updatedMedicine = await db_config_1.default.medicine.update({
            where: { id: req.params.id },
            data: updateData,
        });
        console.log("Medicine updated successfully:", updatedMedicine);
        if (scheduledTimes.length > 0) {
            console.log("Updating reminders with times:", scheduledTimes);
            // Delete existing reminder times first
            await db_config_1.default.reminderTime.deleteMany({
                where: {
                    reminder: {
                        medicineId: req.params.id,
                    },
                },
            });
            // Delete existing reminders
            await db_config_1.default.reminder.deleteMany({
                where: { medicineId: req.params.id },
            });
            // Create new reminder with times
            await db_config_1.default.reminder.create({
                data: {
                    medicineId: req.params.id,
                    repeatEveryDay: true,
                    isActive: true,
                    times: {
                        create: scheduledTimes.map((time) => ({
                            time: createLocalDateTime(dateString, time),
                        })),
                    },
                },
            });
            console.log("Reminders updated successfully");
        }
        return res.status(200).json({
            status: 200,
            message: "Medicine updated successfully",
            updatedMedicine,
        });
    }
    catch (error) {
        console.error("Error updating medicine:", error);
        return res.status(500).json({
            status: 500,
            message: "Internal server error",
            error: error instanceof Error ? error.message : String(error),
        });
    }
};
exports.updateMedicine = updateMedicine;
const deleteMedicine = async (req, res) => {
    try {
        const deletedMedicine = await db_config_1.default.medicine.delete({
            where: { id: req.params.id },
        });
        return res.status(200).json({
            status: 200,
            message: "Medicine deleted successfully",
            deletedMedicine,
        });
    }
    catch (error) {
        return res
            .status(500)
            .json({ status: 500, message: "Internal server error", error });
    }
};
exports.deleteMedicine = deleteMedicine;
const getMedicineTakenDay = async (req, res) => {
    try {
        const { id } = req.params;
        const dateStr = req.query.date;
        if (!dateStr) {
            return res
                .status(400)
                .json({ status: 400, message: "Missing date query param" });
        }
        const date = (0, date_fns_1.startOfDay)((0, date_fns_1.parseISO)(dateStr));
        const takenDay = await db_config_1.default.medicineTakenDay.findFirst({
            where: { medicineId: id, date },
        });
        return res.status(200).json({ status: 200, takenDay });
    }
    catch (error) {
        return res
            .status(500)
            .json({ status: 500, message: "Internal server error", error });
    }
};
exports.getMedicineTakenDay = getMedicineTakenDay;
const setMedicineTakenDay = async (req, res) => {
    try {
        const { id } = req.params;
        const { date, taken } = req.body;
        if (!date || typeof taken !== "string") {
            return res
                .status(400)
                .json({ status: 400, message: "Missing date or taken in body" });
        }
        const day = (0, date_fns_1.startOfDay)((0, date_fns_1.parseISO)(date));
        const takenDay = await db_config_1.default.medicineTakenDay.upsert({
            where: { medicineId_date: { medicineId: id, date: day } },
            update: { taken },
            create: { medicineId: id, date: day, taken },
        });
        return res.status(200).json({ status: 200, takenDay });
    }
    catch (error) {
        return res
            .status(500)
            .json({ status: 500, message: "Internal server error", error });
    }
};
exports.setMedicineTakenDay = setMedicineTakenDay;
const getMedicineTakenHistory = async (req, res) => {
    try {
        const { id } = req.params;
        const { from, to } = req.query;
        if (!from || !to) {
            return res
                .status(400)
                .json({ status: 400, message: "Missing from or to query param" });
        }
        const fromDate = (0, date_fns_1.startOfDay)((0, date_fns_1.parseISO)(from));
        const toDate = (0, date_fns_1.startOfDay)((0, date_fns_1.parseISO)(to));
        const takenHistory = await db_config_1.default.medicineTakenDay.findMany({
            where: {
                medicineId: id,
                date: {
                    gte: fromDate,
                    lte: toDate,
                },
            },
            orderBy: { date: "asc" },
        });
        return res.status(200).json({ status: 200, takenHistory });
    }
    catch (error) {
        return res
            .status(500)
            .json({ status: 500, message: "Internal server error", error });
    }
};
exports.getMedicineTakenHistory = getMedicineTakenHistory;
const getRefillReminders = async (req, res) => {
    try {
        const userEmail = req.query.userEmail;
        if (!userEmail) {
            return res
                .status(400)
                .json({ status: 400, message: "Missing userEmail query param" });
        }
        const medicines = await db_config_1.default.medicine.findMany({
            where: { userEmail },
            select: {
                id: true,
                name: true,
                totalPills: true,
                pillsPerDose: true,
                dosesPerDay: true,
            },
        });
        const now = new Date();
        const reminders = await Promise.all(medicines.map(async (med) => {
            const takenDays = await db_config_1.default.medicineTakenDay.findMany({
                where: { medicineId: med.id },
            });
            let dosesTaken = 0;
            takenDays.forEach((td) => {
                if (td.taken) {
                    dosesTaken += td.taken
                        .split("-")
                        .map((v) => parseInt(v, 10) || 0)
                        .reduce((a, b) => a + b, 0);
                }
            });
            const pillsPerDose = med.pillsPerDose ?? 1;
            const dosesPerDay = med.dosesPerDay ?? 1;
            const totalPills = med.totalPills ?? 0;
            const pillsLeft = totalPills - dosesTaken * pillsPerDose;
            const daysLeft = Math.floor((pillsLeft > 0 ? pillsLeft : 0) / (pillsPerDose * dosesPerDay));
            return {
                id: med.id,
                name: med.name,
                pillsLeft,
                daysLeft,
            };
        }));
        const filtered = reminders.filter((med) => med.pillsLeft <= 20 || med.daysLeft <= 20);
        return res.status(200).json(filtered);
    }
    catch (error) {
        return res
            .status(500)
            .json({ status: 500, message: "Internal server error", error });
    }
};
exports.getRefillReminders = getRefillReminders;
const refillMedicine = async (req, res) => {
    try {
        const { id } = req.params;
        const medicine = await db_config_1.default.medicine.findUnique({ where: { id } });
        if (!medicine) {
            return res
                .status(404)
                .json({ status: 404, message: "Medicine not found" });
        }
        const updateData = {};
        if (medicine.originalTotalPills != null) {
            updateData.totalPills = medicine.originalTotalPills;
        }
        if (medicine.originalDurationDays != null) {
            updateData.durationDays = medicine.originalDurationDays;
        }
        await db_config_1.default.medicineTakenDay.deleteMany({ where: { medicineId: id } });
        const updated = await db_config_1.default.medicine.update({
            where: { id },
            data: updateData,
        });
        return res
            .status(200)
            .json({ status: 200, message: "Medicine refilled", updated });
    }
    catch (error) {
        return res
            .status(500)
            .json({ status: 500, message: "Internal server error", error });
    }
};
exports.refillMedicine = refillMedicine;
const createReminder = async (req, res) => {
    try {
        const { medicineId, time } = req.body;
        if (!medicineId || !time) {
            return res
                .status(400)
                .json({ status: 400, message: "Missing medicineId or time" });
        }
        const reminder = await db_config_1.default.reminder.create({
            data: {
                medicineId,
                repeatEveryDay: true,
                isActive: true,
                times: {
                    create: {
                        time: new Date(time),
                    },
                },
            },
            include: {
                times: true,
            },
        });
        return res.status(201).json({
            status: 201,
            message: "Reminder created successfully",
            reminder,
        });
    }
    catch (error) {
        return res
            .status(500)
            .json({ status: 500, message: "Internal server error", error });
    }
};
exports.createReminder = createReminder;
const createRemindersForExistingMedicines = async (req, res) => {
    try {
        const medicinesWithoutReminders = await db_config_1.default.medicine.findMany({
            where: {
                reminders: {
                    none: {},
                },
            },
        });
        const createdReminders = [];
        for (const medicine of medicinesWithoutReminders) {
            const reminder = await db_config_1.default.reminder.create({
                data: {
                    medicineId: medicine.id,
                    repeatEveryDay: true,
                    isActive: true,
                    times: {
                        create: {
                            time: medicine.scheduledTime,
                        },
                    },
                },
                include: {
                    times: true,
                },
            });
            createdReminders.push(reminder);
        }
        return res.status(200).json({
            status: 200,
            message: `Created ${createdReminders.length} reminders for existing medicines`,
            createdReminders,
        });
    }
    catch (error) {
        return res
            .status(500)
            .json({ status: 500, message: "Internal server error", error });
    }
};
exports.createRemindersForExistingMedicines = createRemindersForExistingMedicines;
const getReminderStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const reminder = await db_config_1.default.reminder.findFirst({
            where: { medicineId: id },
            include: {
                times: true,
            },
        });
        if (!reminder) {
            return res.status(404).json({
                status: 404,
                message: "Reminder not found for this medicine",
            });
        }
        return res.status(200).json({
            status: 200,
            message: "Reminder status retrieved successfully",
            reminder: {
                id: reminder.id,
                isActive: reminder.isActive,
                repeatEveryDay: reminder.repeatEveryDay,
                times: reminder.times.map((time) => ({
                    id: time.id,
                    time: time.time,
                })),
            },
        });
    }
    catch (error) {
        return res
            .status(500)
            .json({ status: 500, message: "Internal server error", error });
    }
};
exports.getReminderStatus = getReminderStatus;
const toggleReminderStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { isActive } = req.body;
        if (typeof isActive !== "boolean") {
            return res.status(400).json({
                status: 400,
                message: "isActive must be a boolean value",
            });
        }
        const reminder = await db_config_1.default.reminder.findFirst({
            where: { medicineId: id },
        });
        if (!reminder) {
            return res.status(404).json({
                status: 404,
                message: "Reminder not found for this medicine",
            });
        }
        const updatedReminder = await db_config_1.default.reminder.update({
            where: { id: reminder.id },
            data: { isActive },
            include: {
                times: true,
            },
        });
        return res.status(200).json({
            status: 200,
            message: `Reminder ${isActive ? "activated" : "deactivated"} successfully`,
            reminder: {
                id: updatedReminder.id,
                isActive: updatedReminder.isActive,
                repeatEveryDay: updatedReminder.repeatEveryDay,
                times: updatedReminder.times.map((time) => ({
                    id: time.id,
                    time: time.time,
                })),
            },
        });
    }
    catch (error) {
        return res
            .status(500)
            .json({ status: 500, message: "Internal server error", error });
    }
};
exports.toggleReminderStatus = toggleReminderStatus;
