import React from "react";
import { formatDistanceToNow } from "date-fns";
import {
  FaBell,
  FaPills,
  FaExclamationTriangle,
  FaInfoCircle,
  FaCheckCircle,
  FaTrash,
  FaCheck,
} from "react-icons/fa";
import { Notification } from "../types/index.ts";
import useNotifications from "../hooks/useNotifications.tsx";

interface NotificationDropdownProps {
  userEmail: string;
}

const NotificationDropdown: React.FC<NotificationDropdownProps> = ({
  userEmail,
}) => {
  const {
    notifications,
    loading,
    unreadCount,
    markAsRead,
    markAllAsRead,
    deleteNotification,
  } = useNotifications(userEmail);

  const getNotificationIcon = (type: Notification["type"]) => {
    switch (type) {
      case "reminder":
        return <FaBell className="w-4 h-4 text-blue-500" />;
      case "missed_dose":
        return <FaExclamationTriangle className="w-4 h-4 text-red-500" />;
      case "refill":
        return <FaPills className="w-4 h-4 text-amber-500" />;
      case "success":
        return <FaCheckCircle className="w-4 h-4 text-green-500" />;
      default:
        return <FaInfoCircle className="w-4 h-4 text-gray-500" />;
    }
  };

  const getNotificationColor = (type: Notification["type"]) => {
    switch (type) {
      case "reminder":
        return "border-l-blue-500 bg-blue-50";
      case "missed_dose":
        return "border-l-red-500 bg-red-50";
      case "refill":
        return "border-l-amber-500 bg-amber-50";
      case "success":
        return "border-l-green-500 bg-green-50";
      default:
        return "border-l-gray-500 bg-gray-50";
    }
  };

  const handleNotificationClick = async (notification: Notification) => {
    if (!notification.isRead) {
      await markAsRead(notification.id);
    }
  };

  const handleDeleteNotification = async (
    e: React.MouseEvent,
    notificationId: string
  ) => {
    e.stopPropagation();
    await deleteNotification(notificationId);
  };

  return (
    <div className="dropdown dropdown-end">
      <button className="btn btn-ghost btn-circle relative group">
        <div className="indicator">
          <FaBell className="h-6 w-6 text-blue-300 group-hover:animate-none" />
          {unreadCount > 0 && (
            <span className="badge badge-xs badge-primary indicator-item animate-pulse">
              {unreadCount > 99 ? "99+" : unreadCount}
            </span>
          )}
        </div>
      </button>

      <div className="dropdown-content bg-white rounded-xl shadow-xl mt-3 w-80 max-h-96 overflow-hidden z-50">
        {/* Header */}
        <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">
              Notifications
            </h3>
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="text-sm text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1"
              >
                <FaCheck className="w-3 h-3" />
                Mark all read
              </button>
            )}
          </div>
        </div>

        {/* Notifications List */}
        <div className="max-h-80 overflow-y-auto">
          {loading ? (
            <div className="p-4 text-center text-gray-500">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500 mx-auto"></div>
              <p className="mt-2">Loading notifications...</p>
            </div>
          ) : notifications.length === 0 ? (
            <div className="p-6 text-center text-gray-500">
              <FaBell className="w-8 h-8 mx-auto mb-2 text-gray-300" />
              <p>No notifications yet</p>
              <p className="text-sm">You're all caught up!</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  onClick={() => handleNotificationClick(notification)}
                  className={`p-4 hover:bg-gray-50 cursor-pointer transition-colors border-l-4 ${getNotificationColor(
                    notification.type
                  )} ${!notification.isRead ? "bg-blue-50" : ""}`}
                >
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 mt-1">
                      {getNotificationIcon(notification.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <p
                            className={`text-sm font-medium ${
                              !notification.isRead
                                ? "text-gray-900"
                                : "text-gray-700"
                            }`}
                          >
                            {notification.title}
                          </p>
                          <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                            {notification.message}
                          </p>
                          {notification.medicineName && (
                            <p className="text-xs text-gray-500 mt-1">
                              Medicine: {notification.medicineName}
                            </p>
                          )}
                          <p className="text-xs text-gray-400 mt-2">
                            {formatDistanceToNow(
                              new Date(notification.createdAt),
                              { addSuffix: true }
                            )}
                          </p>
                        </div>
                        <button
                          onClick={(e) =>
                            handleDeleteNotification(e, notification.id)
                          }
                          className="flex-shrink-0 ml-2 p-1 text-gray-400 hover:text-red-500 transition-colors"
                          title="Delete notification"
                        >
                          <FaTrash className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                  {!notification.isRead && (
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 ml-7"></div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {notifications.length > 0 && (
          <div className="p-3 border-t border-gray-200 bg-gray-50">
            <div className="text-center">
              <p className="text-xs text-gray-500">
                {unreadCount} unread notification{unreadCount !== 1 ? "s" : ""}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationDropdown;
