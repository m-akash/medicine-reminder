import { useState, useEffect } from 'react';
import useAxiosSecure from './useAxiosSecure.tsx';
import { Notification } from '../types/index.ts';

const useNotifications = (userEmail?: string) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);
  const axiosSecure = useAxiosSecure();

  // Fetch notifications from API
  const fetchNotifications = async () => {
    if (!userEmail) {
      setLoading(false);
      return;
    }

    try {
      const response = await axiosSecure.get(`/api/notifications/${userEmail}`);
      const fetchedNotifications = response.data.notifications || [];
      setNotifications(fetchedNotifications);
      setUnreadCount(fetchedNotifications.filter((n: Notification) => !n.isRead).length);
    } catch (error) {
      console.error('Error fetching notifications:', error);
      // For demo purposes, create some mock notifications
      const mockNotifications: Notification[] = [
        {
          id: '1',
          userEmail: userEmail,
          title: 'Medicine Reminder',
          message: 'Time to take your morning dose of Aspirin',
          type: 'reminder',
          isRead: false,
          createdAt: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
          medicineName: 'Aspirin'
        },
        {
          id: '2',
          userEmail: userEmail,
          title: 'Missed Dose Alert',
          message: 'You missed your evening dose of Vitamin D',
          type: 'missed_dose',
          isRead: false,
          createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
          medicineName: 'Vitamin D'
        },
        {
          id: '3',
          userEmail: userEmail,
          title: 'Refill Reminder',
          message: 'Your prescription for Ibuprofen is running low',
          type: 'refill',
          isRead: true,
          createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
          medicineName: 'Ibuprofen'
        }
      ];
      setNotifications(mockNotifications);
      setUnreadCount(mockNotifications.filter(n => !n.isRead).length);
    } finally {
      setLoading(false);
    }
  };

  // Mark notification as read
  const markAsRead = async (notificationId: string) => {
    try {
      await axiosSecure.patch(`/api/notifications/${notificationId}/read`);
      setNotifications(prev => 
        prev.map(n => 
          n.id === notificationId ? { ...n, isRead: true } : n
        )
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Error marking notification as read:', error);
      // Update locally even if API fails
      setNotifications(prev => 
        prev.map(n => 
          n.id === notificationId ? { ...n, isRead: true } : n
        )
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    }
  };

  // Mark all notifications as read
  const markAllAsRead = async () => {
    try {
      await axiosSecure.patch(`/api/notifications/${userEmail}/read-all`);
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
      setUnreadCount(0);
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      // Update locally even if API fails
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
      setUnreadCount(0);
    }
  };

  // Delete notification
  const deleteNotification = async (notificationId: string) => {
    try {
      await axiosSecure.delete(`/api/notifications/${notificationId}`);
      const notification = notifications.find(n => n.id === notificationId);
      setNotifications(prev => prev.filter(n => n.id !== notificationId));
      if (notification && !notification.isRead) {
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
    } catch (error) {
      console.error('Error deleting notification:', error);
      // Remove locally even if API fails
      const notification = notifications.find(n => n.id === notificationId);
      setNotifications(prev => prev.filter(n => n.id !== notificationId));
      if (notification && !notification.isRead) {
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, [userEmail]);

  return {
    notifications,
    loading,
    unreadCount,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    refetch: fetchNotifications
  };
};

export default useNotifications; 