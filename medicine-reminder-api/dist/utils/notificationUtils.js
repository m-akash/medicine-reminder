"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createSystemNotification = exports.createSuccessNotification = exports.createRefillReminderNotification = exports.createMissedDoseNotification = exports.createMedicineReminderNotification = exports.createNotification = void 0;
const db_config_1 = __importDefault(require("../config/db.config"));
const createNotification = async (data) => {
    try {
        const notification = await db_config_1.default.notification.create({
            data: {
                userEmail: data.userEmail,
                title: data.title,
                message: data.message,
                type: data.type,
                medicineId: data.medicineId,
                medicineName: data.medicineName,
            },
        });
        console.log(`Notification created: ${notification.title} for ${data.userEmail}`);
        return notification;
    }
    catch (error) {
        console.error("Error creating notification:", error);
        throw error;
    }
};
exports.createNotification = createNotification;
const createMedicineReminderNotification = async (userEmail, medicineName, dosage, doseTime, medicineId) => {
    return (0, exports.createNotification)({
        userEmail,
        title: "Medicine Reminder",
        message: `Time to take your ${doseTime.toLowerCase()} dose of ${medicineName} (${dosage})`,
        type: "reminder",
        medicineId,
        medicineName,
    });
};
exports.createMedicineReminderNotification = createMedicineReminderNotification;
const createMissedDoseNotification = async (userEmail, medicineName, dosage, doseTime, medicineId) => {
    return (0, exports.createNotification)({
        userEmail,
        title: "Missed Dose Alert",
        message: `You missed your ${doseTime.toLowerCase()} dose of ${medicineName} (${dosage}). Please take it as soon as possible.`,
        type: "missed_dose",
        medicineId,
        medicineName,
    });
};
exports.createMissedDoseNotification = createMissedDoseNotification;
const createRefillReminderNotification = async (userEmail, medicineName, remainingDays, medicineId) => {
    return (0, exports.createNotification)({
        userEmail,
        title: "Refill Reminder",
        message: `Your prescription for ${medicineName} is running low. You have approximately ${remainingDays} days left. Please refill your prescription.`,
        type: "refill",
        medicineId,
        medicineName,
    });
};
exports.createRefillReminderNotification = createRefillReminderNotification;
const createSuccessNotification = async (userEmail, title, message, medicineName, medicineId) => {
    return (0, exports.createNotification)({
        userEmail,
        title,
        message,
        type: "success",
        medicineId,
        medicineName,
    });
};
exports.createSuccessNotification = createSuccessNotification;
const createSystemNotification = async (userEmail, title, message) => {
    return (0, exports.createNotification)({
        userEmail,
        title,
        message,
        type: "system",
    });
};
exports.createSystemNotification = createSystemNotification;
