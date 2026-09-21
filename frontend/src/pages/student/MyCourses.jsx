import { useEffect, useState } from "react";
import { getMyEnrollments } from "../../services/courseService";

function MyCourses() {
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadEnrollments = async () => {
      try {
        const data = await getMyEnrollments();
        setEnrollments(data);
      } catch (error) {
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
        enrollments.map((enrollment) => (
          <div key={enrollment.id}>
            <h2>{enrollment.course_title}</h2>
            <p>Enrolled: {enrollment.enrolled_at}</p>
          </div>
        ))
      )}
    </div>
  );
}

export default MyCourses;