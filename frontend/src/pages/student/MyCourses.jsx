import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getMyEnrollments } from "../../services/courseService";
import { issueCertificate } from "../../services/certificateService";

function MyCourses() {
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [issuingCourseId, setIssuingCourseId] = useState(null);
  const [certificateResults, setCertificateResults] = useState({});

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

  // Request certificate from Django API
  const handleGetCertificate = async (courseId) => {
    setIssuingCourseId(courseId);

    setCertificateResults((previous) => ({
      ...previous,
      [courseId]: null,
    }));

    try {
      const result = await issueCertificate(courseId);

      setCertificateResults((previous) => ({
        ...previous,
        [courseId]: {
          success: true,
          message: result.created
            ? "Certificate issued successfully!"
            : "You already have a certificate for this course.",
        },
      }));
    } catch (err) {
      const message =
        err.response?.data?.error ||
        "Unable to issue certificate. Please try again.";

      setCertificateResults((previous) => ({
        ...previous,
        [courseId]: {
          success: false,
          message,
        },
      }));
    } finally {
      setIssuingCourseId(null);
    }
  };

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
          const courseId = enrollment.course;
          const certificateResult = certificateResults[courseId];

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

              <p>Enrolled: {enrollment.enrolled_at}</p>

              <h3>Progress</h3>

              <p>
                {enrollment.completed_lessons} of{" "}
                {enrollment.total_lessons} lessons completed
              </p>

              <p>
                <strong>{progress}%</strong>
              </p>

              {/* Progress Bar */}
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
                <p>✓ All Lessons Completed</p>
              )}

              <br />

              {/* Course Navigation */}
              <Link to={`/student/courses/${courseId}/learn`}>
                {learningButtonText}
              </Link>

              {" | "}

              <Link to={`/student/courses/${courseId}/assignments`}>
                Assignments
              </Link>

              {" | "}

              <Link to={`/student/courses/${courseId}/discussions`}>
                Discussions
              </Link>

              {/* Certificate Section */}
              {progress === 100 && (
                <div className="mt-4">
                  {certificateResult?.success ? (
                    <Link
                      to="/student/certificates"
                      className="inline-block rounded-lg bg-green-700 px-5 py-3 font-medium text-white hover:bg-green-800"
                    >
                      🎓 View Certificate
                    </Link>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleGetCertificate(courseId)}
                      disabled={issuingCourseId !== null}
                      className="rounded-lg bg-blue-700 px-5 py-3 font-medium text-white hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {issuingCourseId === courseId
                        ? "Checking eligibility..."
                        : "🎓 Get Certificate"}
                    </button>
                  )}

                  {/* Success / Error Message */}
                  {certificateResult && (
                    <p
                      role="status"
                      className={`mt-2 text-sm ${
                        certificateResult.success
                          ? "text-green-700"
                          : "text-red-700"
                      }`}
                    >
                      {certificateResult.message}
                    </p>
                  )}
                </div>
              )}
            </div>
          );
        })
      )}
    </div>
  );
}

export default MyCourses;