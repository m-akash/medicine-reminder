"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_controller_1 = require("../controllers/user.controller");
const router = express_1.default.Router();
router.get("/users", user_controller_1.getUsers);
router.get("/user/:email", user_controller_1.findUserByEmail);
router.post("/user/register", user_controller_1.createUser);
router.post("/user/social-login", user_controller_1.socialLogin);
router.put("/user/:email", user_controller_1.updateUser);
router.delete("/user/:email/account", user_controller_1.deleteUserAccount);
router.post("/user/save-fcm-token", user_controller_1.saveFcmToken);
router.get("/user/:email/settings", user_controller_1.getUserSettings);
router.put("/user/:email/settings", user_controller_1.saveUserSettings);
exports.default = router;
