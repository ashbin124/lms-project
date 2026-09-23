import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getInstructorCourses, deleteCourse } from "../../services/courseService";


function InstructorCourses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadCourses = async () => {
      try {
        const data = await getInstructorCourses();
        setCourses(data);
      } catch (error) {
        setError("Failed to load courses.");
      } finally {
        setLoading(false);
      }
    };

    loadCourses();
  }, []);

  const handleDelete = async (courseId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this course?"
    );

    if (!confirmed) {
      return;
    }

    try {
      await deleteCourse(courseId);

      setCourses((currentCourses) =>
        currentCourses.filter((course) => course.id !== courseId)
      );
    } catch (error) {
      setError("Failed to delete course.");
    }
  };

  if (loading) {
    return <p>Loading courses...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div>
      <h1>My Courses</h1>

      {courses.length === 0 ? (
        <p>You have not created any courses yet.</p>
      ) : (
        <div>
          {courses.map((course) => (
            <div key={course.id}>
              <h2>{course.title}</h2>

              <p>{course.description}</p>

              <p>Category: {course.category_name}</p>

              <p>Level: {course.level}</p>

              <p>Status: {course.status}</p>

              <Link to={`/instructor/courses/${course.id}/edit`}>
                Edit course
              </Link>

              <Link to={`/instructor/courses/${course.id}/lessons`}>
                Manage Content
              </Link>
              <button onClick={() => handleDelete(course.id)}>
                Delete Course
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default InstructorCourses;