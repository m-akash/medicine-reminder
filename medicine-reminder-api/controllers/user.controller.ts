import { Request, Response } from "express";
import prisma from "../config/db.config";

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
        .json({ status: 400, message: "User already taken!" });
    }
    const newUser = await prisma.user.create({
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

const socialLogin = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { email, name, password } = req.body;
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
          password,
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

export {
  findUserByEmail,
  createUser,
  socialLogin,
  getUsers,
  updateUser,
  deleteUser,
};
