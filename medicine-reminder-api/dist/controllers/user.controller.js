"use strict";
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
exports.saveUserSettings =
  exports.getUserSettings =
  exports.saveFcmToken =
  exports.deleteUser =
  exports.updateUser =
  exports.getUsers =
  exports.socialLogin =
  exports.createUser =
  exports.findUserByEmail =
    void 0;
const db_config_1 = __importDefault(require("../config/db.config"));
const getUsers = async (req, res) => {
  try {
    const users = await db_config_1.default.user.findMany();
    return res.json({ status: 200, message: "Finds all the users", users });
  } catch (error) {
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
  } catch (error) {
    return res
      .status(500)
      .json({ status: 500, message: "Internal server error", error });
  }
};
exports.findUserByEmail = findUserByEmail;
const createUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
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
        password,
        lastLogin: new Date(),
      },
    });
    return res.status(201).json({
      status: 201,
      message: "User created successfully",
      newUser,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ status: 500, message: "Internal server error", error });
  }
};
exports.createUser = createUser;
const socialLogin = async (req, res) => {
  try {
    const { email, name, password } = req.body;
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
    } else {
      const newUser = await db_config_1.default.user.create({
        data: {
          name,
          email,
          password: "social-login",
          lastLogin: new Date(),
        },
      });
      return res
        .status(201)
        .json({ status: 201, message: "Login successful", user: newUser });
    }
  } catch (error) {
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
        password: req.body.password,
      },
    });
    return res.status(200).json({
      status: 200,
      message: "User update successfully!",
      updatedUser,
    });
  } catch (error) {
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
  } catch (error) {
    return res
      .status(500)
      .json({ status: 500, message: "Internal server error", error });
  }
};
exports.deleteUser = deleteUser;
const saveFcmToken = async (req, res) => {
  const { email, token } = req.body;
  if (!email || !token)
    return res.status(400).json({ error: "Missing email or token" });
  try {
    await db_config_1.default.user.update({
      where: { email },
      data: { fcmToken: token },
    });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Failed to save token" });
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
      // Return default settings if none exist
      const defaultSettings = {
        notifications: {
          enabled: true,
          reminderAdvance: 30,
          missedDoseAlerts: true,
          refillReminders: true,
          dailySummary: false,
        },
        medicineDefaults: {
          defaultDosesPerDay: 2,
          defaultReminderTimes: ["08:00", "20:00"],
          defaultDurationDays: 30,
        },
        privacy: {
          dataSharing: false,
          analytics: true,
        },
        appearance: {
          theme: "auto",
          compactMode: false,
          showAvatars: true,
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
        appearance: userSettings.appearance,
      },
    });
  } catch (error) {
    return res
      .status(500)
      .json({ status: 500, message: "Internal server error", error });
  }
};
exports.getUserSettings = getUserSettings;
const saveUserSettings = async (req, res) => {
  try {
    const { email } = req.params;
    const { notifications, medicineDefaults, privacy, appearance } = req.body;
    // Validate that user exists
    const user = await db_config_1.default.user.findUnique({
      where: { email },
    });
    if (!user) {
      return res.status(404).json({ status: 404, message: "User not found" });
    }
    // Upsert settings (create if doesn't exist, update if exists)
    const userSettings = await db_config_1.default.userSettings.upsert({
      where: { userEmail: email },
      update: {
        notifications,
        medicineDefaults,
        privacy,
        appearance,
      },
      create: {
        userEmail: email,
        notifications,
        medicineDefaults,
        privacy,
        appearance,
      },
    });
    return res.status(200).json({
      status: 200,
      message: "Settings saved successfully",
      settings: {
        notifications: userSettings.notifications,
        medicineDefaults: userSettings.medicineDefaults,
        privacy: userSettings.privacy,
        appearance: userSettings.appearance,
      },
    });
  } catch (error) {
    return res
      .status(500)
      .json({ status: 500, message: "Internal server error", error });
  }
};
exports.saveUserSettings = saveUserSettings;
