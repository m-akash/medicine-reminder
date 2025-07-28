import express from "express";
import {
  createUser,
  findUserByEmail,
  getUsers,
  socialLogin,
  updateUser,
  saveFcmToken,
  getUserSettings,
  saveUserSettings,
  deleteUserAccount,
} from "../controllers/user.controller";
const router = express.Router();

router.get("/users", getUsers);
router.get("/user/:email", findUserByEmail);
router.post("/user/register", createUser);
router.post("/user/social-login", socialLogin);
router.put("/user/:email", updateUser);
router.delete("/user/:email/account", deleteUserAccount);
router.post("/user/save-fcm-token", saveFcmToken);
router.get("/user/:email/settings", getUserSettings);
router.put("/user/:email/settings", saveUserSettings);

export default router;
