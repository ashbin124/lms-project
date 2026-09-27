import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
  getInstructorAssignments,
  updateAssignment,
} from "../../services/courseService";

function EditAssignment() {
  const { courseId, assignmentId } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [maxMarks, setMaxMarks] = useState("");
  const [attachment, setAttachment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadAssignment = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getInstructorAssignments();

        const assignment = data.find(
          (item) => item.id === Number(assignmentId)
        );

        if (!assignment) {
          setError("Assignment not found.");
          return;
        }

        setTitle(assignment.title);
        setDescription(assignment.description);

        const date = new Date(assignment.due_date);

        const localDate = new Date(
          date.getTime() - date.getTimezoneOffset() * 60000
        )
          .toISOString()
          .slice(0, 16);

        setDueDate(localDate);
        setMaxMarks(assignment.max_marks);
      } catch (err) {
        console.error(err);
        setError("Failed to load assignment.");
      } finally {
        setLoading(false);
      }
    };

    loadAssignment();
  }, [assignmentId]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setSubmitting(true);
      setError("");

      const formData = new FormData();

      formData.append("course", courseId);
      formData.append("title", title);
      formData.append("description", description);
      formData.append(
        "due_date",
        new Date(dueDate).toISOString()
      );
      formData.append("max_marks", maxMarks);

      if (attachment) {
        formData.append("attachment", attachment);
      }

      await updateAssignment(assignmentId, formData);

      navigate(
        `/instructor/courses/${courseId}/assignments`
      );
    } catch (err) {
      console.error(err);
      setError("Failed to update assignment.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <p>Loading assignment...</p>;
  }

  return (
    <div>
      <h1>Edit Assignment</h1>

      {error && <p>{error}</p>}

      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="title">Title</label>

          <input
            id="title"
            type="text"
            value={title}
            onChange={(event) =>
              setTitle(event.target.value)
            }
            required
          />
        </div>

        <div>
          <label htmlFor="description">
            Description
          </label>

          <textarea
            id="description"
            value={description}
            onChange={(event) =>
              setDescription(event.target.value)
            }
            required
          />
        </div>

        <div>
          <label htmlFor="dueDate">
            Due Date
          </label>

          <input
            id="dueDate"
            type="datetime-local"
            value={dueDate}
            onChange={(event) =>
              setDueDate(event.target.value)
            }
            required
          />
        </div>

        <div>
          <label htmlFor="maxMarks">
            Maximum Marks
          </label>

          <input
            id="maxMarks"
            type="number"
            min="1"
            value={maxMarks}
            onChange={(event) =>
              setMaxMarks(event.target.value)
            }
            required
          />
        </div>

        <div>
          <label htmlFor="attachment">
            Replace Attachment (Optional)
          </label>

          <input
            id="attachment"
            type="file"
            onChange={(event) =>
              setAttachment(
                event.target.files[0] || null
              )
            }
          />
        </div>

        <button
          type="submit"
          disabled={submitting}
        >
          {submitting
            ? "Updating..."
            : "Update Assignment"}
        </button>
      </form>
    </div>
  );
}

export default EditAssignment;