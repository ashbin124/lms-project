import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  getInstructorLessons,
  updateLesson,
} from "../../services/courseService";

function EditLesson() {
  const { courseId, lessonId } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [order, setOrder] = useState(1);
  const [video, setVideo] = useState(null);

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadLesson = async () => {
      try {
        const lessons = await getInstructorLessons();

        const lesson = lessons.find(
          (item) => item.id === Number(lessonId)
        );

        if (!lesson || lesson.course !== Number(courseId)) {
          setError("Lesson not found.");
          return;
        }

        setTitle(lesson.title);
        setContent(lesson.content);
        setOrder(lesson.order);
      } catch {
        setError("Failed to load lesson.");
      } finally {
        setLoading(false);
      }
    };

    loadLesson();
  }, [courseId, lessonId]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSubmitting(true);

    const formData = new FormData();

    formData.append("title", title);
    formData.append("content", content);
    formData.append("order", order);

    if (video) {
      formData.append("video", video);
    }

    try {
      await updateLesson(lessonId, formData);

      navigate(`/instructor/courses/${courseId}/lessons`);
    } catch (err) {
      console.error(err);
      setError("Failed to update lesson.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <p>Loading lesson...</p>;
  }

  if (error && !title) {
    return <p>{error}</p>;
  }

  return (
    <div>
      <h1>Edit Lesson</h1>

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
          <label>Replace Video (optional)</label>

          <input
            type="file"
            accept=".mp4,.webm,.mov"
            onChange={(e) => setVideo(e.target.files[0])}
          />
        </div>

        {error && <p>{error}</p>}

        <button type="submit" disabled={submitting}>
          {submitting ? "Updating..." : "Update Lesson"}
        </button>
      </form>
    </div>
  );
}

export default EditLesson;