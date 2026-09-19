import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getPublicCourse } from "../../services/courseService";

function CourseDetails() {
  const { courseId } = useParams();

  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadCourse = async () => {
      try {
        const data = await getPublicCourse(courseId);
        setCourse(data);
      } catch (error) {
        setError("Course not found.");
      } finally {
        setLoading(false);
      }
    };

    loadCourse();
  }, [courseId]);

  if (loading) {
    return <p>Loading course...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div>
      <h1>{course.title}</h1>

      <p>{course.description}</p>
      <p>Instructor: {course.instructor_name}</p>
      <p>Category: {course.category_name}</p>
      <p>Level: {course.level}</p>
    </div>
  );
}

export default CourseDetails;