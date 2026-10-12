import { useEffect, useState } from "react";
import {
  getNotifications,
  markNotificationRead,
  markAllNotificationsRead,
} from "../services/notificationService";
export default function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadNotifications = async () => {
      try {
        const data = await getNotifications();
        setNotifications(data);
      } catch (err) {
        console.error(err);
        setError("Failed to load notifications.");
      } finally {
        setLoading(false);
      }
    };

    loadNotifications();
  }, []);

  const handleMarkRead = async (notificationId) => {
  try {
    await markNotificationRead(notificationId);

    setNotifications((previous) =>
      previous.map((notification) =>
        notification.id === notificationId
          ? { ...notification, is_read: true }
          : notification
      )
    );
  } catch (err) {
    console.error(err);
    setError("Failed to mark notification as read.");
  }
};


const handleMarkAllRead = async () => {
  try {
    await markAllNotificationsRead();

    setNotifications((previous) =>
      previous.map((notification) => ({
        ...notification,
        is_read: true,
      }))
    );
  } catch (err) {
    console.error(err);
    setError("Failed to mark all notifications as read.");
  }
};
  if (loading) {
    return <p>Loading notifications...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div>
      <h1>Notifications</h1>
      {notifications.some((notification) => !notification.is_read) && (
  <button type="button" onClick={handleMarkAllRead}>
    Mark All as Read
  </button>
)}

      {notifications.length === 0 ? (
        <p>No notifications yet.</p>
      ) : (
        notifications.map((notification) => (
          <div key={notification.id}>
            <h3>{notification.title}</h3>
            <p>{notification.message}</p>
            <small>
              {notification.is_read ? "Read" : "Unread"}
            </small>
            {!notification.is_read && (
  <button
    type="button"
    onClick={() => handleMarkRead(notification.id)}
  >
    Mark as Read
  </button>
)}
          </div>
        ))
      )}
    </div>
  );
}