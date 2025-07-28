"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.testFirebaseAdmin = exports.deleteUserAccount = exports.saveUserSettings = exports.getUserSettings = exports.saveFcmToken = exports.deleteUser = exports.updateUser = exports.getUsers = exports.socialLogin = exports.createUser = exports.findUserByEmail = void 0;
const db_config_1 = __importDefault(require("../config/db.config"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const firebaseAdmin_1 = __importDefault(require("../firebaseAdmin"));
const saltRounds = 10;
const getUsers = async (req, res) => {
    try {
        const users = await db_config_1.default.user.findMany();
        return res.json({ status: 200, message: "Finds all the users", users });
    }
    catch (error) {
        return res
            .status(500)
            .json({ status: 500, message: "Internal server error", error });
    }
};
exports.getUsers = getUsers;
const findUserByEmail = async (req, res) => {
    try {
        const findUser = await db_config_1.default.user.findUniqueOrThrow({
            where: { email: req.params.email },
        });
        return res
            .status(200)
            .json({ status: 200, message: "Find user successfully!", findUser });
    }
    catch (error) {
        return res
            .status(500)
            .json({ status: 500, message: "Internal server error", error });
    }
};
exports.findUserByEmail = findUserByEmail;
const createUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const hashedPassword = await bcrypt_1.default.hash(password, saltRounds);
        if (!name || !email || !password) {
            return res
                .status(400)
                .json({ status: 400, message: "All fields are required!" });
        }
        const findUser = await db_config_1.default.user.findUnique({
            where: { email },
        });
        if (findUser) {
            return res
                .status(400)
                .json({ status: 400, message: "User already taken" });
        }
        const newUser = await db_config_1.default.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                lastLogin: new Date(),
            },
        });
        return res.status(201).json({
            status: 201,
            message: "User created successfully",
            newUser,
        });
    }
    catch (error) {
        return res
            .status(500)
            .json({ status: 500, message: "Internal server error", error });
    }
};
exports.createUser = createUser;
const socialLogin = async (req, res) => {
    try {
        const { email, name, tokenForNotification } = req.body;
        const user = await db_config_1.default.user.findUnique({
            where: { email },
        });
        if (user) {
            const updatedUser = await db_config_1.default.user.update({
                where: { email },
                data: { lastLogin: new Date() },
            });
            return res
                .status(200)
                .json({ status: 200, message: "Login successful", user: updatedUser });
        }
        else {
            const newUser = await db_config_1.default.user.create({
                data: {
                    name,
                    email,
                    password: "social-login",
                    lastLogin: new Date(),
                    fcmToken: tokenForNotification,
                },
            });
            return res
                .status(201)
                .json({ status: 201, message: "Login successful", user: newUser });
        }
    }
    catch (error) {
        return res
            .status(500)
            .json({ status: 500, message: "Internal server error", error });
    }
};
exports.socialLogin = socialLogin;
const updateUser = async (req, res) => {
    try {
        const email = req.params.email;
        const findUser = await db_config_1.default.user.findUnique({
            where: { email },
        });
        if (!findUser) {
            return res
                .status(404)
                .json({ status: 404, message: "User not found!", email });
        }
        const updatedUser = await db_config_1.default.user.update({
            where: { email: email },
            data: {
                name: req.body.name,
                email: req.body.email,
                // password: req.body.password,
            },
        });
        return res.status(200).json({
            status: 200,
            message: "User update successfully!",
            updatedUser,
        });
    }
    catch (error) {
        return res
            .status(500)
            .json({ status: 500, message: "Internal server error", error });
    }
};
exports.updateUser = updateUser;
const deleteUser = async (req, res) => {
    try {
        const email = req.params.email;
        const findUser = await db_config_1.default.user.findUnique({
            where: { email },
        });
        if (!findUser) {
            return res
                .status(404)
                .json({ status: 404, message: "User not found!", email });
        }
        const deletedUser = await db_config_1.default.user.delete({
            where: { email: email },
        });
        return res.status(200).json({
            status: 200,
            message: "User delete successfully!",
            deletedUser,
        });
    }
    catch (error) {
        return res
            .status(500)
            .json({ status: 500, message: "Internal server error", error });
    }
};
exports.deleteUser = deleteUser;
const saveFcmToken = async (req, res) => {
    const { email, tokenForNotification } = req.body;
    if (!email || !tokenForNotification)
        return res
            .status(400)
            .json({ error: "Missing email or tokenForNotification" });
    try {
        await db_config_1.default.user.update({
            where: { email },
            data: { fcmToken: tokenForNotification },
        });
        res.json({ success: true });
    }
    catch (err) {
        res.status(500).json({ error: "Failed to save tokenForNotification" });
    }
};
exports.saveFcmToken = saveFcmToken;
const getUserSettings = async (req, res) => {
    try {
        const { email } = req.params;
        const userSettings = await db_config_1.default.userSettings.findUnique({
            where: { userEmail: email },
        });
        if (!userSettings) {
            const defaultSettings = {
                notifications: {
                    enabled: true,
                    reminderAdvance: 30,
                    missedDoseAlerts: true,
                    refillReminders: true,
                    dailySummary: false,
                },
                medicineDefaults: {
                    defaultDosesPerDay: 1,
                    defaultReminderTimes: ["08:00", "14:00", "20:00"],
                    defaultDurationDays: 0,
                },
                privacy: {
                    dataSharing: false,
                    analytics: true,
                },
            };
            return res.status(200).json({
                status: 200,
                message: "Default settings returned",
                settings: defaultSettings,
            });
        }
        return res.status(200).json({
            status: 200,
            message: "Settings retrieved successfully",
            settings: {
                notifications: userSettings.notifications,
                medicineDefaults: userSettings.medicineDefaults,
                privacy: userSettings.privacy,
            },
        });
    }
    catch (error) {
        return res
            .status(500)
            .json({ status: 500, message: "Internal server error", error });
    }
};
exports.getUserSettings = getUserSettings;
const saveUserSettings = async (req, res) => {
    try {
        const { email } = req.params;
        const { notifications, medicineDefaults, privacy } = req.body;
        const user = await db_config_1.default.user.findUnique({
            where: { email },
        });
        if (!user) {
            return res.status(404).json({ status: 404, message: "User not found" });
        }
        const userSettings = await db_config_1.default.userSettings.upsert({
            where: { userEmail: email },
            update: {
                notifications,
                medicineDefaults,
                privacy,
            },
            create: {
                userEmail: email,
                notifications,
                medicineDefaults,
                privacy,
            },
        });
        return res.status(200).json({
            status: 200,
            message: "Settings saved successfully",
            settings: {
                notifications: userSettings.notifications,
                medicineDefaults: userSettings.medicineDefaults,
                privacy: userSettings.privacy,
            },
        });
    }
    catch (error) {
        return res
            .status(500)
            .json({ status: 500, message: "Internal server error", error });
    }
};
exports.saveUserSettings = saveUserSettings;
const deleteUserAccount = async (req, res) => {
    try {
        const { email } = req.params;
        console.log(`Starting account deletion for: ${email}`);
        // First, find and delete from database
        const user = await db_config_1.default.user.findUnique({
            where: { email },
            include: {
                medicines: true,
                settings: true,
                notifications: true,
            },
        });
        if (!user) {
            return res.status(404).json({
                status: 404,
                message: "User not found",
            });
        }
        // Delete from database first (this is the most important part)
        await db_config_1.default.user.delete({
            where: { email },
        });
        console.log(`Database user deleted: ${email}`);
        // Try to delete from Firebase (but don't fail if it doesn't work)
        let firebaseResult = "not_attempted";
        try {
            const firebaseUser = await firebaseAdmin_1.default.auth().getUserByEmail(email);
            await firebaseAdmin_1.default.auth().deleteUser(firebaseUser.uid);
            firebaseResult = "deleted";
            console.log(`Firebase user deleted: ${email}`);
        }
        catch (firebaseError) {
            firebaseResult = `error: ${firebaseError.code}`;
            console.log(`Firebase deletion failed for ${email}: ${firebaseError.code}`);
        }
        return res.status(200).json({
            status: 200,
            message: "Account deleted successfully",
            details: {
                email: user.email,
                databaseDeleted: true,
                firebaseResult: firebaseResult,
                medicinesCount: user.medicines.length,
                notificationsCount: user.notifications.length,
            },
        });
    }
    catch (error) {
        console.error("Account deletion error:", error);
        return res.status(500).json({
            status: 500,
            message: "Failed to delete account",
            error: error.message,
        });
    }
};
exports.deleteUserAccount = deleteUserAccount;
// Test endpoint to verify Firebase Admin is working
const testFirebaseAdmin = async (req, res) => {
    try {
        const { email } = req.params;
        console.log(`Testing Firebase Admin for email: ${email}`);
        try {
            const firebaseUser = await firebaseAdmin_1.default.auth().getUserByEmail(email);
            console.log(`Firebase user found: ${firebaseUser.uid}`);
            return res.status(200).json({
                status: 200,
                message: "Firebase Admin is working correctly",
                firebaseUser: {
                    uid: firebaseUser.uid,
                    email: firebaseUser.email,
                    displayName: firebaseUser.displayName,
                    emailVerified: firebaseUser.emailVerified,
                },
            });
        }
        catch (error) {
            console.error("Firebase Admin test error:", error);
            return res.status(404).json({
                status: 404,
                message: "Firebase user not found or error occurred",
                error: {
                    code: error.code,
                    message: error.message,
                },
            });
        }
    }
    catch (error) {
        console.error("Test Firebase Admin error:", error);
        return res.status(500).json({
            status: 500,
            message: "Internal server error",
            error: error.message,
        });
    }
};
exports.testFirebaseAdmin = testFirebaseAdmin;
