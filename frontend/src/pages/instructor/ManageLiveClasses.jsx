import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import {
  getLiveClasses,
  deleteLiveClass,
} from "../../services/courseService";


function ManageLiveClasses() {
  const { courseId } = useParams();

  const [liveClasses, setLiveClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");


  useEffect(() => {
    const loadLiveClasses = async () => {
      try {
        const data = await getLiveClasses();

        const courseLiveClasses = data.filter(
          (liveClass) =>
            liveClass.course === Number(courseId)
        );

        setLiveClasses(courseLiveClasses);
      } catch {
        setError("Failed to load live classes.");
      } finally {
        setLoading(false);
      }
    };

    loadLiveClasses();
  }, [courseId]);


  const handleDelete = async (liveClassId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this live class?"
    );

    if (!confirmed) {
      return;
    }

    try {
      await deleteLiveClass(liveClassId);

      setLiveClasses((currentLiveClasses) =>
        currentLiveClasses.filter(
          (liveClass) =>
            liveClass.id !== liveClassId
        )
      );
    } catch {
      setError("Failed to delete live class.");
    }
  };


  if (loading) {
    return <p>Loading live classes...</p>;
  }


  if (error) {
    return <p>{error}</p>;
  }


  const courseTitle =
    liveClasses.length > 0
      ? liveClasses[0].course_title
      : "Course";


  return (
    <div>
      <h1>Manage Live Classes</h1>

      <h2>{courseTitle}</h2>

      <Link
        to={`/instructor/courses/${courseId}/live-classes/create`}
      >
        Create Live Class
      </Link>

      <hr />

      {liveClasses.length === 0 ? (
        <p>
          No live classes have been created for this course yet.
        </p>
      ) : (
        liveClasses.map((liveClass) => (
          <div key={liveClass.id}>
            <h3>{liveClass.title}</h3>

            {liveClass.description && (
              <p>{liveClass.description}</p>
            )}

            <p>
              <strong>Status:</strong>{" "}
              {liveClass.status}
            </p>

            <p>
              <strong>Starts:</strong>{" "}
              {new Date(
                liveClass.starts_at
              ).toLocaleString()}
            </p>

            <p>
              <strong>Ends:</strong>{" "}
              {new Date(
                liveClass.ends_at
              ).toLocaleString()}
            </p>

            <p>
              <a
                href={liveClass.meeting_url}
                target="_blank"
                rel="noreferrer"
              >
                Open Meeting Link
              </a>
            </p>

            <Link
              to={`/instructor/courses/${courseId}/live-classes/${liveClass.id}/edit`}
            >
              Edit
            </Link>

            {" | "}

            <button
              onClick={() =>
                handleDelete(liveClass.id)
              }
            >
              Delete
            </button>

            <hr />
          </div>
        ))
      )}

      <Link to="/instructor/courses">
        Back to My Courses
      </Link>
    </div>
  );
}


export default ManageLiveClasses;