import { useEffect, useState } from "react";
import {
  Link,
  useNavigate,
  useParams,
} from "react-router-dom";

import {
  getLiveClasses,
  updateLiveClass,
} from "../../services/courseService";


function EditLiveClass() {
  const { courseId, liveClassId } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    starts_at: "",
    ends_at: "",
    meeting_url: "",
  });

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] =
    useState(false);
  const [error, setError] = useState("");


  const toDateTimeLocal = (value) => {
    const date = new Date(value);

    const timezoneOffset =
      date.getTimezoneOffset();

    const localDate = new Date(
      date.getTime() -
        timezoneOffset * 60 * 1000
    );

    return localDate
      .toISOString()
      .slice(0, 16);
  };


  useEffect(() => {
    const loadLiveClass = async () => {
      try {
        const data = await getLiveClasses();

        const liveClass = data.find(
          (item) =>
            item.id === Number(liveClassId) &&
            item.course === Number(courseId)
        );

        if (!liveClass) {
          setError("Live class not found.");
          return;
        }

        setFormData({
          title: liveClass.title,
          description:
            liveClass.description || "",
          starts_at: toDateTimeLocal(
            liveClass.starts_at
          ),
          ends_at: toDateTimeLocal(
            liveClass.ends_at
          ),
          meeting_url:
            liveClass.meeting_url,
        });
      } catch {
        setError("Failed to load live class.");
      } finally {
        setLoading(false);
      }
    };

    loadLiveClass();
  }, [courseId, liveClassId]);


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

      await updateLiveClass(
        liveClassId,
        {
          title: formData.title,
          description: formData.description,
          starts_at: formData.starts_at,
          ends_at: formData.ends_at,
          meeting_url: formData.meeting_url,
        }
      );

      navigate(
        `/instructor/courses/${courseId}/live-classes`
      );
    } catch (error) {
      const apiError =
        error.response?.data?.ends_at?.[0] ||
        error.response?.data?.meeting_url?.[0] ||
        "Failed to update live class.";

      setError(apiError);
    } finally {
      setSubmitting(false);
    }
  };


  if (loading) {
    return <p>Loading live class...</p>;
  }


  return (
    <div>
      <h1>Edit Live Class</h1>

      {error && <p>{error}</p>}

      {!error && (
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
              required
            />
          </div>

          <br />

          <button
            type="submit"
            disabled={submitting}
          >
            {submitting
              ? "Saving..."
              : "Save Changes"}
          </button>
        </form>
      )}

      <br />

      <Link
        to={`/instructor/courses/${courseId}/live-classes`}
      >
        Back to Live Classes
      </Link>
    </div>
  );
}


export default EditLiveClass;