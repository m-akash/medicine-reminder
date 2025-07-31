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
import verifyToken from "../middlewares/jwtMiddleware";
const router = express.Router();

router.get("/users", getUsers);
router.get("/user/:email", findUserByEmail);
router.post("/user/register", createUser);
router.post("/user/social-login", socialLogin);
router.put("/user/:email", verifyToken, updateUser);
router.delete("/user/:email/account", verifyToken, deleteUserAccount);
router.post("/user/save-fcm-token", saveFcmToken);
router.get("/user/:email/settings", verifyToken, getUserSettings);
router.put("/user/:email/settings", verifyToken, saveUserSettings);

export default router;
