import { useEffect, useState } from "react";

import {
  getStudentLiveClasses,
} from "../../services/courseService";


function LiveClasses() {
  const [liveClasses, setLiveClasses] =
    useState([]);
  const [loading, setLoading] =
    useState(true);
  const [error, setError] =
    useState("");


  useEffect(() => {
    const loadLiveClasses = async () => {
      try {
        const data =
          await getStudentLiveClasses();

        setLiveClasses(data);
      } catch {
        setError(
          "Failed to load live classes."
        );
      } finally {
        setLoading(false);
      }
    };

    loadLiveClasses();
  }, []);


  if (loading) {
    return <p>Loading live classes...</p>;
  }


  if (error) {
    return <p>{error}</p>;
  }


  return (
    <div>
      <h1>Live Classes</h1>

      {liveClasses.length === 0 ? (
        <p>
          No live classes are currently
          scheduled for your courses.
        </p>
      ) : (
        liveClasses.map((liveClass) => (
          <div key={liveClass.id}>
            <h2>{liveClass.title}</h2>

            <p>
              <strong>Course:</strong>{" "}
              {liveClass.course_title}
            </p>

            {liveClass.description && (
              <p>
                {liveClass.description}
              </p>
            )}

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
              <strong>Status:</strong>{" "}
              {liveClass.status}
            </p>

            {liveClass.status ===
            "ENDED" ? (
              <p>Class Ended</p>
            ) : (
              <a
                href={
                  liveClass.meeting_url
                }
                target="_blank"
                rel="noreferrer"
              >
                Join Class
              </a>
            )}

            <hr />
          </div>
        ))
      )}
    </div>
  );
}


export default LiveClasses;