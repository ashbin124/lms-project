import { useState } from "react";
import {
  Link,
  useNavigate,
  useParams,
} from "react-router-dom";

import {
  createLiveClass,
} from "../../services/courseService";


function CreateLiveClass() {
  const { courseId } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    starts_at: "",
    ends_at: "",
    meeting_url: "",
  });

  const [error, setError] = useState("");
  const [submitting, setSubmitting] =
    useState(false);


  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((currentData) => ({
      ...currentData,
      [name]: value,
    }));
  };


  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");

    if (
      new Date(formData.ends_at) <=
      new Date(formData.starts_at)
    ) {
      setError(
        "End time must be later than start time."
      );
      return;
    }

    try {
      setSubmitting(true);

      await createLiveClass({
        course: Number(courseId),
        title: formData.title,
        description: formData.description,
        starts_at: formData.starts_at,
        ends_at: formData.ends_at,
        meeting_url: formData.meeting_url,
      });

      navigate(
        `/instructor/courses/${courseId}/live-classes`
      );
    } catch (error) {
      const apiError =
        error.response?.data?.ends_at?.[0] ||
        error.response?.data?.course ||
        error.response?.data?.meeting_url?.[0] ||
        "Failed to create live class.";

      setError(apiError);
    } finally {
      setSubmitting(false);
    }
  };


  return (
    <div>
      <h1>Create Live Class</h1>

      {error && (
        <p>{error}</p>
      )}

      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="title">
            Title
          </label>

          <br />

          <input
            id="title"
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </div>

        <br />

        <div>
          <label htmlFor="description">
            Description
          </label>

          <br />

          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
          />
        </div>

        <br />

        <div>
          <label htmlFor="starts_at">
            Start Date & Time
          </label>

          <br />

          <input
            id="starts_at"
            type="datetime-local"
            name="starts_at"
            value={formData.starts_at}
            onChange={handleChange}
            required
          />
        </div>

        <br />

        <div>
          <label htmlFor="ends_at">
            End Date & Time
          </label>

          <br />

          <input
            id="ends_at"
            type="datetime-local"
            name="ends_at"
            value={formData.ends_at}
            onChange={handleChange}
            required
          />
        </div>

        <br />

        <div>
          <label htmlFor="meeting_url">
            Meeting URL
          </label>

          <br />

          <input
            id="meeting_url"
            type="url"
            name="meeting_url"
            value={formData.meeting_url}
            onChange={handleChange}
            placeholder="https://meet.google.com/..."
            required
          />
        </div>

        <br />

        <button
          type="submit"
          disabled={submitting}
        >
          {submitting
            ? "Creating..."
            : "Create Live Class"}
        </button>
      </form>

      <br />

      <Link
        to={`/instructor/courses/${courseId}/live-classes`}
      >
        Back to Live Classes
      </Link>
    </div>
  );
}


export default CreateLiveClass;