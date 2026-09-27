import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import {
  getInstructorSubmissions,
  gradeSubmission,
} from "../../services/courseService";

function AssignmentSubmissions() {
  const { assignmentId } = useParams();

  const [submissions, setSubmissions] = useState([]);
  const [grading, setGrading] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadSubmissions = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getInstructorSubmissions();

      const assignmentSubmissions = data.filter(
        (submission) =>
          submission.assignment === Number(assignmentId)
      );

      setSubmissions(assignmentSubmissions);

      const initialGrading = {};

      assignmentSubmissions.forEach((submission) => {
        initialGrading[submission.id] = {
          marks: submission.marks ?? "",
          feedback: submission.feedback ?? "",
        };
      });

      setGrading(initialGrading);
    } catch (err) {
      console.error(err);
      setError("Failed to load submissions.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSubmissions();
  }, [assignmentId]);

  const handleChange = (submissionId, field, value) => {
    setGrading((current) => ({
      ...current,
      [submissionId]: {
        ...current[submissionId],
        [field]: value,
      },
    }));
  };

  const handleGrade = async (submissionId) => {
    try {
      setError("");

      const grade = grading[submissionId];

      await gradeSubmission(submissionId, {
        marks: grade.marks,
        feedback: grade.feedback,
      });

      await loadSubmissions();
    } catch (err) {
      console.error(err);
      setError("Failed to grade submission.");
    }
  };

  if (loading) {
    return <p>Loading submissions...</p>;
  }

  return (
    <div>
      <h1>Assignment Submissions</h1>

      {error && <p>{error}</p>}

      {submissions.length === 0 ? (
        <p>No students have submitted this assignment yet.</p>
      ) : (
        submissions.map((submission) => (
          <div key={submission.id}>
            <h2>
              Student ID: {submission.student}
            </h2>

            <p>
              Submitted:{" "}
              {new Date(
                submission.submitted_at
              ).toLocaleString()}
            </p>

            {submission.comment && (
              <p>Comment: {submission.comment}</p>
            )}

            <p>
              <a
                href={submission.submission_file}
                target="_blank"
                rel="noreferrer"
              >
                Open Submission
              </a>
            </p>

            <div>
              <label
                htmlFor={`marks-${submission.id}`}
              >
                Marks
              </label>

              <input
                id={`marks-${submission.id}`}
                type="number"
                min="0"
                value={
                  grading[submission.id]?.marks ?? ""
                }
                onChange={(event) =>
                  handleChange(
                    submission.id,
                    "marks",
                    event.target.value
                  )
                }
              />
            </div>

            <div>
              <label
                htmlFor={`feedback-${submission.id}`}
              >
                Feedback
              </label>

              <textarea
                id={`feedback-${submission.id}`}
                value={
                  grading[submission.id]?.feedback ??
                  ""
                }
                onChange={(event) =>
                  handleChange(
                    submission.id,
                    "feedback",
                    event.target.value
                  )
                }
              />
            </div>

            <button
              onClick={() =>
                handleGrade(submission.id)
              }
            >
              Save Grade
            </button>

            {submission.graded_at && (
              <p>
                Last graded:{" "}
                {new Date(
                  submission.graded_at
                ).toLocaleString()}
              </p>
            )}

            <hr />
          </div>
        ))
      )}
    </div>
  );
}

export default AssignmentSubmissions;