import express from "express";
import {
  createUser,
  deleteUser,
  findUserByEmail,
  getUsers,
  socialLogin,
  updateUser,
  saveFcmToken,
} from "../controllers/user.controller";
const router = express.Router();

router.get("/users", getUsers);
router.get("/user/:email", findUserByEmail);
router.post("/user/register", createUser);
router.post("/user/social-login", socialLogin);
router.put("/user/:email", updateUser);
router.delete("/user/:email", deleteUser);
router.post("/user/save-fcm-token", saveFcmToken);

export default router;
