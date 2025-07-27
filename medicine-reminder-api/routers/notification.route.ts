import express from "express";
import verifyToken from "../middlewares/jwtMiddleware";
import {
  getNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification,
} from "../controllers/notification.controller";

const router = express.Router();

router.get("/notifications/:userEmail", verifyToken, getNotifications);
router.patch(
  "/notifications/:notificationId/read",
  verifyToken,
  markNotificationAsRead
);
router.patch(
  "/notifications/:userEmail/read-all",
  verifyToken,
  markAllNotificationsAsRead
);
router.delete(
  "/notifications/:notificationId",
  verifyToken,
  deleteNotification
);

export default router;
