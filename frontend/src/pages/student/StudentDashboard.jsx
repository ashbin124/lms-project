import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import AuthContext from "../../context/AuthContext";
import { getNotifications } from "../../services/notificationService";

function StudentDashboard() {
  const { logout } = useContext(AuthContext);
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

  const handleLogout = () => {
    logout();
    navigate("/login");
  };


  return (
    <div>
      <h1>Student Dashboard</h1>

      <p>
        Welcome to the LMS student dashboard.
      </p>

      <button
        onClick={() =>
          navigate("/student/my-courses")
        }
      >
        My Courses
      </button>

      {" "}

      <button
        onClick={() =>
          navigate("/student/live-classes")
        }
      >
        Live Classes
      </button>

      {" "}

      <button
  onClick={() => navigate("/student/notifications")}
>
  🔔 Notifications ({unreadCount})
</button>

{" "}

      <button onClick={handleLogout}>
        Logout
      </button>
    </div>
  );
}


export default StudentDashboard;