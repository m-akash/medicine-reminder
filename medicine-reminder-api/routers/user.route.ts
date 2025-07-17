import express from "express";
import {
  createUser,
  deleteUser,
  findUserByEmail,
  getUsers,
  socialLogin,
  updateUser,
} from "../controllers/user.controller";
const router = express.Router();

router.get("/users", getUsers);
router.get("/user/:email", findUserByEmail);
router.post("/user/register", createUser);
router.post("/user/social-login", socialLogin);
router.put("/user/:email", updateUser);
router.delete("/user/:email", deleteUser);

export default router;
