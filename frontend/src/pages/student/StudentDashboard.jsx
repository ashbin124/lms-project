import { useContext } from "react";
import { useNavigate } from "react-router-dom";

import AuthContext from "../../context/AuthContext";


function StudentDashboard() {
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();


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

      <button onClick={handleLogout}>
        Logout
      </button>
    </div>
  );
}


export default StudentDashboard;