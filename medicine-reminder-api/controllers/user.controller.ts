import { Request, Response } from "express";
import prisma from "../config/db.config";
import bcrypt from "bcrypt";

const saltRounds = 10;

const getUsers = async (req: Request, res: Response): Promise<Response> => {
  try {
    const users = await prisma.user.findMany();
    return res.json({ status: 200, message: "Finds all the users", users });
  } catch (error) {
    return res
      .status(500)
      .json({ status: 500, message: "Internal server error", error });
  }
};

const findUserByEmail = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const findUser = await prisma.user.findUniqueOrThrow({
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

const createUser = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { name, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ status: 400, message: "All fields are required!" });
    }
    const findUser = await prisma.user.findUnique({
      where: { email },
    });
    if (findUser) {
      return res
        .status(400)
        .json({ status: 400, message: "User already taken" });
    }
    const newUser = await prisma.user.create({
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
  } catch (error) {
    return res
      .status(500)
      .json({ status: 500, message: "Internal server error", error });
  }
};

const socialLogin = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { email, name, tokenForNotification } = req.body;
    const user = await prisma.user.findUnique({
      where: { email },
    });
    if (user) {
      const updatedUser = await prisma.user.update({
        where: { email },
        data: { lastLogin: new Date() },
      });
      return res
        .status(200)
        .json({ status: 200, message: "Login successful", user: updatedUser });
    } else {
      const newUser = await prisma.user.create({
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
  } catch (error) {
    return res
      .status(500)
      .json({ status: 500, message: "Internal server error", error });
  }
};

const updateUser = async (req: Request, res: Response): Promise<Response> => {
  try {
    const email = req.params.email;
    const findUser = await prisma.user.findUnique({
      where: { email },
    });
    if (!findUser) {
      return res
        .status(404)
        .json({ status: 404, message: "User not found!", email });
    }
    const updatedUser = await prisma.user.update({
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
  } catch (error) {
    return res
      .status(500)
      .json({ status: 500, message: "Internal server error", error });
  }
};

const deleteUser = async (req: Request, res: Response): Promise<Response> => {
  try {
    const email = req.params.email;
    const findUser = await prisma.user.findUnique({
      where: { email },
    });
    if (!findUser) {
      return res
        .status(404)
        .json({ status: 404, message: "User not found!", email });
    }
    const deletedUser = await prisma.user.delete({
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

const saveFcmToken = async (req: Request, res: Response) => {
  const { email, tokenForNotification } = req.body;
  if (!email || !tokenForNotification)
    return res
      .status(400)
      .json({ error: "Missing email or tokenForNotification" });

  try {
    await prisma.user.update({
      where: { email },
      data: { fcmToken: tokenForNotification },
    });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Failed to save tokenForNotification" });
  }
};

const getUserSettings = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { email } = req.params;

    const userSettings = await prisma.userSettings.findUnique({
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
  } catch (error) {
    return res
      .status(500)
      .json({ status: 500, message: "Internal server error", error });
  }
};

const saveUserSettings = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { email } = req.params;
    const { notifications, medicineDefaults, privacy } = req.body;

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(404).json({ status: 404, message: "User not found" });
    }

    const userSettings = await prisma.userSettings.upsert({
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
  } catch (error) {
    return res
      .status(500)
      .json({ status: 500, message: "Internal server error", error });
  }
};

export {
  findUserByEmail,
  createUser,
  socialLogin,
  getUsers,
  updateUser,
  deleteUser,
  saveFcmToken,
  getUserSettings,
  saveUserSettings,
};
