import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getPublicCourse, enrollInCourse } from "../../services/courseService";

function CourseDetails() {
  const { courseId } = useParams();

  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [enrollMessage, setEnrollMessage] = useState("");
  const [enrolling, setEnrolling] = useState(false);

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

    const handleEnroll = async () => {
    setEnrollMessage("");
    setEnrolling(true);

    try {
     await enrollInCourse(courseId);
     setEnrollMessage("Enrollment successful.");
    } catch (error) {
    const message =
      error.response?.data?.non_field_errors?.[0] ||
      error.response?.data?.course?.[0] ||
      "Failed to enroll in this course.";

    setEnrollMessage(message);
    } finally {
    setEnrolling(false);
    }
};

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

      <button onClick={handleEnroll} disabled={enrolling}>
        {enrolling ? "Enrolling..." : "Enroll"}
      </button>

        {enrollMessage && <p>{enrollMessage}</p>}
    </div>
  );
}

export default CourseDetails;