import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import {
  deleteAssignment,
  getInstructorAssignments,
} from "../../services/courseService";


function ManageAssignments() {
  const { courseId } = useParams();

  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadAssignments = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getInstructorAssignments();

      const courseAssignments = data.filter(
        (assignment) => assignment.course === Number(courseId)
      );

      setAssignments(courseAssignments);
    } catch (err) {
      console.error(err);
      setError("Failed to load assignments.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAssignments();
  }, [courseId]);

  const handleDelete = async (assignmentId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this assignment?"
    );

    if (!confirmed) {
      return;
    }

    try {
      await deleteAssignment(assignmentId);
      await loadAssignments();
    } catch (err) {
      console.error(err);
      setError("Failed to delete assignment.");
    }
  };

  if (loading) {
    return <p>Loading assignments...</p>;
  }

  return (
    <div>
      <h1>Manage Assignments</h1>

      <Link to={`/instructor/courses/${courseId}/assignments/create`}>
        Create Assignment
      </Link>

      {error && <p>{error}</p>}

      {assignments.length === 0 ? (
        <p>No assignments have been created for this course yet.</p>
      ) : (
        assignments.map((assignment) => (
          <div key={assignment.id}>
            <h2>{assignment.title}</h2>

            <p>{assignment.description}</p>

            <p>
              Due: {new Date(assignment.due_date).toLocaleString()}
            </p>

            <p>Maximum Marks: {assignment.max_marks}</p>

            {assignment.attachment && (
              <p>
                <a
                  href={assignment.attachment}
                  target="_blank"
                  rel="noreferrer"
                >
                  Open Attachment
                </a>
              </p>
            )}

            <Link
              to={`/instructor/courses/${courseId}/assignments/${assignment.id}/edit`}
            >
              Edit Assignment
            </Link>

            {" | "}

            <Link
              to={`/instructor/courses/${courseId}/assignments/${assignment.id}/submissions`}
            >
              View Submissions
            </Link>

            {" | "}

            <button onClick={() => handleDelete(assignment.id)}>
              Delete Assignment
            </button>
          </div>
        ))
      )}
    </div>
  );
}

export default ManageAssignments;