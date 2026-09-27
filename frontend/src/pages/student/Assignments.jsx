import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import {
  getStudentAssignments,
  getMySubmissions,
  submitAssignment,
} from "../../services/courseService";

function Assignments() {
  const { courseId } = useParams();

  const [assignments, setAssignments] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [files, setFiles] = useState({});
  const [comments, setComments] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");

      const assignmentData =
        await getStudentAssignments();

      const submissionData =
        await getMySubmissions();

      const courseAssignments =
        assignmentData.filter(
          (assignment) =>
            assignment.course === Number(courseId)
        );

      setAssignments(courseAssignments);
      setSubmissions(submissionData);
    } catch (err) {
      console.error(err);
      setError("Failed to load assignments.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [courseId]);

  const getSubmission = (assignmentId) => {
    return submissions.find(
      (submission) =>
        submission.assignment === assignmentId
    );
  };

  const handleSubmit = async (assignmentId) => {
    const file = files[assignmentId];

    if (!file) {
      setError("Please select a submission file.");
      return;
    }

    try {
      setError("");

      const formData = new FormData();

      formData.append(
        "assignment",
        assignmentId
      );

      formData.append(
        "submission_file",
        file
      );

      formData.append(
        "comment",
        comments[assignmentId] || ""
      );

      await submitAssignment(formData);

      await loadData();
    } catch (err) {
      console.error(err);
      setError("Failed to submit assignment.");
    }
  };

  if (loading) {
    return <p>Loading assignments...</p>;
  }

  return (
    <div>
      <h1>Assignments</h1>

      {error && <p>{error}</p>}

      {assignments.length === 0 ? (
        <p>
          No assignments are available for this
          course.
        </p>
      ) : (
        assignments.map((assignment) => {
          const submission =
            getSubmission(assignment.id);

          return (
            <div key={assignment.id}>
              <h2>{assignment.title}</h2>

              <p>{assignment.description}</p>

              <p>
                Due:{" "}
                {new Date(
                  assignment.due_date
                ).toLocaleString()}
              </p>

              <p>
                Maximum Marks:{" "}
                {assignment.max_marks}
              </p>

              {assignment.attachment && (
                <p>
                  <a
                    href={assignment.attachment}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Open Assignment Attachment
                  </a>
                </p>
              )}

              {submission ? (
                <div>
                  <p>Submitted ✅</p>

                  <p>
                    Submitted:{" "}
                    {new Date(
                      submission.submitted_at
                    ).toLocaleString()}
                  </p>

                  <p>
                    <a
                      href={
                        submission.submission_file
                      }
                      target="_blank"
                      rel="noreferrer"
                    >
                      Open My Submission
                    </a>
                  </p>

                  {submission.marks !== null ? (
                    <>
                      <p>
                        Marks: {submission.marks} /{" "}
                        {assignment.max_marks}
                      </p>

                      <p>
                        Feedback:{" "}
                        {submission.feedback ||
                          "No feedback provided."}
                      </p>
                    </>
                  ) : (
                    <p>Not graded yet.</p>
                  )}
                </div>
              ) : (
                <div>
                  <div>
                    <label
                      htmlFor={`file-${assignment.id}`}
                    >
                      Submission File
                    </label>

                    <input
                      id={`file-${assignment.id}`}
                      type="file"
                      onChange={(event) =>
                        setFiles((current) => ({
                          ...current,
                          [assignment.id]:
                            event.target.files[0] ||
                            null,
                        }))
                      }
                    />
                  </div>

                  <div>
                    <label
                      htmlFor={`comment-${assignment.id}`}
                    >
                      Comment (Optional)
                    </label>

                    <textarea
                      id={`comment-${assignment.id}`}
                      value={
                        comments[assignment.id] || ""
                      }
                      onChange={(event) =>
                        setComments((current) => ({
                          ...current,
                          [assignment.id]:
                            event.target.value,
                        }))
                      }
                    />
                  </div>

                  <button
                    onClick={() =>
                      handleSubmit(assignment.id)
                    }
                  >
                    Submit Assignment
                  </button>
                </div>
              )}

              <hr />
            </div>
          );
        })
      )}
    </div>
  );
}

export default Assignments;