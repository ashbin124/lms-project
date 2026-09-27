import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { createAssignment } from "../../services/courseService";


function CreateAssignment() {
  const { courseId } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [maxMarks, setMaxMarks] = useState("");
  const [attachment, setAttachment] = useState(null);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

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

      await createAssignment(formData);

      navigate(
        `/instructor/courses/${courseId}/assignments`
      );
    } catch (err) {
      console.error(err);
      setError("Failed to create assignment.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <h1>Create Assignment</h1>

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
          <label htmlFor="dueDate">Due Date</label>

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
            Attachment (Optional)
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
            ? "Creating..."
            : "Create Assignment"}
        </button>
      </form>
    </div>
  );
}

export default CreateAssignment;