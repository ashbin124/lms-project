import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getNotifications } from "../../services/notificationService";

function InstructorDashboard() {
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
      <h1>Instructor Dashboard</h1>

      <p>Welcome to the LMS instructor dashboard.</p>

      <button
        type="button"
        onClick={() => navigate("/instructor/notifications")}
      >
        🔔 Notifications ({unreadCount})
      </button>
    </div>
  );
}

export default InstructorDashboard;