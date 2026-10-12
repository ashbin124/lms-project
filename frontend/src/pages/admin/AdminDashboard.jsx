import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getNotifications } from "../../services/notificationService";

function AdminDashboard() {
  const navigate = useNavigate();
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const loadUnreadCount = async () => {
      try {
        const notifications = await getNotifications();

        setUnreadCount(
          notifications.filter((notification) => !notification.is_read).length
        );
      } catch (error) {
        console.error("Failed to load unread notifications:", error);
      }
    };

    loadUnreadCount();
  }, []);

  return (
    <div>
      <h1>Admin Dashboard</h1>

      <p>Welcome to the LMS admin dashboard.</p>

      <button
        type="button"
        onClick={() => navigate("/admin/notifications")}
      >
        🔔 Notifications ({unreadCount})
      </button>
    </div>
  );
}

export default AdminDashboard;