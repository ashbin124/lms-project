import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { createLesson } from "../../services/courseService";

function CreateLesson() {
  const { courseId } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [order, setOrder] = useState(1);
  const [video, setVideo] = useState(null);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSubmitting(true);

    const formData = new FormData();

    formData.append("course", courseId);
    formData.append("title", title);
    formData.append("content", content);
    formData.append("order", order);

    if (video) {
      formData.append("video", video);
    }

    try {
      await createLesson(formData);

      navigate(`/instructor/courses/${courseId}/lessons`);
    } catch (err) {
      console.error(err);
      setError("Failed to create lesson.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <h1>Add Lesson</h1>

      <form onSubmit={handleSubmit}>
        <div>
          <label>Lesson Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        <div>
          <label>Content</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
        </div>

        <div>
          <label>Lesson Order</label>
          <input
            type="number"
            min="1"
            value={order}
            onChange={(e) => setOrder(e.target.value)}
          />
        </div>

        <div>
          <label>Lesson Video</label>
          <input
            type="file"
            accept=".mp4,.webm,.mov"
            onChange={(e) => setVideo(e.target.files[0])}
          />
        </div>

        {error && <p>{error}</p>}

        <button type="submit" disabled={submitting}>
          {submitting ? "Creating..." : "Create Lesson"}
        </button>
      </form>
    </div>
  );
}

export default CreateLesson;