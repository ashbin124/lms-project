import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { createStudyMaterial } from "../../services/courseService";

function AddMaterial() {
  const { courseId, lessonId } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [file, setFile] = useState(null);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSubmitting(true);

    const formData = new FormData();

    formData.append("lesson", lessonId);
    formData.append("title", title);

    if (file) {
      formData.append("file", file);
    }

    try {
      await createStudyMaterial(formData);

      navigate(`/instructor/courses/${courseId}/lessons`);
    } catch (err) {
      console.error(err);
      setError("Failed to upload study material.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <h1>Add Study Material</h1>

      <form onSubmit={handleSubmit}>
        <div>
          <label>Material Title</label>

          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        <div>
          <label>File</label>

          <input
            type="file"
            accept=".pdf,.doc,.docx,.ppt,.pptx,.zip"
            onChange={(e) => setFile(e.target.files[0])}
            required
          />
        </div>

        {error && <p>{error}</p>}

        <button type="submit" disabled={submitting}>
          {submitting ? "Uploading..." : "Upload Material"}
        </button>
      </form>
    </div>
  );
}

export default AddMaterial;