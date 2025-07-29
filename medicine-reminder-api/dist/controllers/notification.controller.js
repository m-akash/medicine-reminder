"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteNotification = exports.markAllNotificationsAsRead = exports.markNotificationAsRead = exports.getNotifications = void 0;
const db_config_1 = __importDefault(require("../config/db.config"));
const getNotifications = async (req, res) => {
    try {
        const { userEmail } = req.params;
        const notifications = await db_config_1.default.notification.findMany({
            where: {
                userEmail: userEmail,
            },
            orderBy: {
                createdAt: "desc",
            },
        });
        res.status(200).json({
            success: true,
            notifications: notifications,
        });
    }
    catch (error) {
        console.error("Error fetching notifications:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch notifications",
        });
    }
};
exports.getNotifications = getNotifications;
const markNotificationAsRead = async (req, res) => {
    try {
        const { notificationId } = req.params;
        const updatedNotification = await db_config_1.default.notification.update({
            where: {
                id: notificationId,
            },
            data: {
                isRead: true,
            },
        });
        res.status(200).json({
            success: true,
            notification: updatedNotification,
        });
    }
    catch (error) {
        console.error("Error marking notification as read:", error);
        res.status(500).json({
            success: false,
            message: "Failed to mark notification as read",
        });
    }
};
exports.markNotificationAsRead = markNotificationAsRead;
const markAllNotificationsAsRead = async (req, res) => {
    try {
        const { userEmail } = req.params;
        await db_config_1.default.notification.updateMany({
            where: {
                userEmail: userEmail,
                isRead: false,
            },
            data: {
                isRead: true,
            },
        });
        res.status(200).json({
            success: true,
            message: "All notifications marked as read",
        });
    }
    catch (error) {
        console.error("Error marking all notifications as read:", error);
        res.status(500).json({
            success: false,
            message: "Failed to mark all notifications as read",
        });
    }
};
exports.markAllNotificationsAsRead = markAllNotificationsAsRead;
const deleteNotification = async (req, res) => {
    try {
        const { notificationId } = req.params;
        await db_config_1.default.notification.delete({
            where: {
                id: notificationId,
            },
        });
        res.status(200).json({
            success: true,
            message: "Notification deleted successfully",
        });
    }
    catch (error) {
        console.error("Error deleting notification:", error);
        res.status(500).json({
            success: false,
            message: "Failed to delete notification",
        });
    }
};
exports.deleteNotification = deleteNotification;
