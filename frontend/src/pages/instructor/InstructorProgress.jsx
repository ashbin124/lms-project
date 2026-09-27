import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import {
  getInstructorProgress,
} from "../../services/courseService";


function InstructorProgress() {
  const { courseId } = useParams();

  const [progressData, setProgressData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");


  useEffect(() => {
    const loadProgress = async () => {
      try {
        const data = await getInstructorProgress();

        const courseProgress = data.filter(
          (item) =>
            item.course === Number(courseId)
        );

        setProgressData(courseProgress);
      } catch {
        setError(
          "Failed to load student progress."
        );
      } finally {
        setLoading(false);
      }
    };

    loadProgress();
  }, [courseId]);


  if (loading) {
    return <p>Loading student progress...</p>;
  }


  if (error) {
    return <p>{error}</p>;
  }


  return (
    <div>
      <h1>Student Progress</h1>

      {progressData.length === 0 ? (
        <p>
          No students are enrolled in this course yet.
        </p>
      ) : (
        <>
          <h2>
            {progressData[0].course_title}
          </h2>

          {progressData.map((item) => (
            <div key={item.id}>
              <h3>
                {item.student_email}
              </h3>

              <p>
                {item.completed_lessons} of{" "}
                {item.total_lessons} lessons completed
              </p>

              <p>
                <strong>
                  {item.progress_percentage}%
                </strong>
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
                    width: `${item.progress_percentage}%`,
                    height: "100%",
                    backgroundColor: "#22c55e",
                  }}
                />
              </div>

              {item.progress_percentage === 100 && (
                <p>✓ Course Completed</p>
              )}

              <hr />
            </div>
          ))}
        </>
      )}
    </div>
  );
}


export default InstructorProgress;