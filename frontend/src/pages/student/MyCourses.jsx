import { useEffect, useState } from "react";
import { getMyEnrollments } from "../../services/courseService";
import { Link } from "react-router-dom";

function MyCourses() {
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadEnrollments = async () => {
      try {
        const data = await getMyEnrollments();
        setEnrollments(data);
      } catch {
        setError("Failed to load your courses.");
      } finally {
        setLoading(false);
      }
    };

    loadEnrollments();
  }, []);

  if (loading) {
    return <p>Loading your courses...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div>
      <h1>My Courses</h1>

      {enrollments.length === 0 ? (
        <p>You have not enrolled in any courses yet.</p>
      ) : (
        enrollments.map((enrollment) => {
          const progress = enrollment.progress_percentage;

          let learningButtonText = "Start Learning";

          if (progress > 0 && progress < 100) {
            learningButtonText = "Continue Learning";
          }

          if (progress === 100) {
            learningButtonText = "Review Course";
          }

          return (
            <div key={enrollment.id}>
              <h2>{enrollment.course_title}</h2>

              <p>
                Enrolled: {enrollment.enrolled_at}
              </p>

              <h3>Progress</h3>

              <p>
                {enrollment.completed_lessons} of{" "}
                {enrollment.total_lessons} lessons completed
              </p>

              <p>
                <strong>{progress}%</strong>
              </p>

              <div
                style={{
                  width: "100%",
                  maxWidth: "500px",
                  height: "15px",
                  backgroundColor: "#e5e7eb",
                  borderRadius: "10px",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    width: `${progress}%`,
                    height: "100%",
                    backgroundColor: "#22c55e",
                  }}
                />
              </div>

              {progress === 100 && (
                <p>✓ Course Completed</p>
              )}

              <br />

              <Link
                to={`/student/courses/${enrollment.course}/learn`}
              >
                {learningButtonText}
              </Link>

              {" | "}

              <Link
                to={`/student/courses/${enrollment.course}/assignments`}
              >
                Assignments
              </Link>
            </div>
          );
        })
      )}
    </div>
  );
}

export default MyCourses;