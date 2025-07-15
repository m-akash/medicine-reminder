import express from "express";
import {
  createUser,
  deleteUser,
  findUserByEmail,
  getUsers,
  updateUser,
} from "../controllers/user.controller";
const router = express.Router();

router.get("/users", getUsers);
router.get("/user/:email", findUserByEmail);
router.post("/user", createUser);
router.put("/user/:email", updateUser);
router.delete("/user/:email", deleteUser);

export default router;
