"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const jwtMiddleware_1 = __importDefault(require("../middlewares/jwtMiddleware"));
const notification_controller_1 = require("../controllers/notification.controller");
const router = express_1.default.Router();
router.get("/notifications/:userEmail", jwtMiddleware_1.default, notification_controller_1.getNotifications);
router.patch("/notifications/:notificationId/read", jwtMiddleware_1.default, notification_controller_1.markNotificationAsRead);
router.patch("/notifications/:userEmail/read-all", jwtMiddleware_1.default, notification_controller_1.markAllNotificationsAsRead);
router.delete("/notifications/:notificationId", jwtMiddleware_1.default, notification_controller_1.deleteNotification);
exports.default = router;
