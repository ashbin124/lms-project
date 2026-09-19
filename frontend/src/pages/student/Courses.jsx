import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getPublicCourses } from "../../services/courseService";

function Courses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadCourses = async () => {
      try {
        const data = await getPublicCourses();
        setCourses(data);
      } catch (error) {
        setError("Failed to load courses.");
      } finally {
        setLoading(false);
      }
    };

    loadCourses();
  }, []);

  if (loading) {
    return <p>Loading courses...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div>
      <h1>Courses</h1>

      {courses.length === 0 ? (
        <p>No courses available.</p>
      ) : (
        <div>
          {courses.map((course) => (
            <div key={course.id}>
              <h2>{course.title}</h2>
              <p>{course.description}</p>
              <p>Instructor: {course.instructor_name}</p>
              <p>Category: {course.category_name}</p>
              <p>Level: {course.level}</p>

              <Link to={`/courses/${course.id}`}>
                View Course
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Courses;