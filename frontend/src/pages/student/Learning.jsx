import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getStudentLessons } from "../../services/courseService";

function Learning() {
  const { courseId } = useParams();

  const [lessons, setLessons] = useState([]);
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadLessons = async () => {
      try {
        const data = await getStudentLessons();

        const courseLessons = data.filter(
          (lesson) => lesson.course === Number(courseId)
        );

        setLessons(courseLessons);

        if (courseLessons.length > 0) {
          setSelectedLesson(courseLessons[0]);
        }
      } catch {
        setError("Failed to load course lessons.");
      } finally {
        setLoading(false);
      }
    };

    loadLessons();
  }, [courseId]);

  if (loading) return <p>Loading lessons...</p>;

  if (error) return <p>{error}</p>;

  if (lessons.length === 0) {
    return <p>No lessons are available for this course yet.</p>;
  }

  return (
    <div>
      <h1>Course Learning</h1>

      <div>
        <h2>Lessons</h2>

        {lessons.map((lesson) => (
          <button
            key={lesson.id}
            onClick={() => setSelectedLesson(lesson)}
          >
            {lesson.order}. {lesson.title}
          </button>
        ))}
      </div>

      {selectedLesson && (
        <div>
          <h2>{selectedLesson.title}</h2>

          {selectedLesson.video ? (
            <video controls width="700">
              <source src={selectedLesson.video} />
              Your browser does not support the video tag.
            </video>
          ) : (
            <p>No video available for this lesson.</p>
          )}

          <p>{selectedLesson.content}</p>

          <h3>Study Materials</h3>

          {selectedLesson.materials?.length > 0 ? (
            selectedLesson.materials.map((material) => (
              <div key={material.id}>
                <span>{material.title}</span>{" "}

                <a
                  href={material.file}
                  target="_blank"
                  rel="noreferrer"
                >
                  Open / Download
                </a>
              </div>
            ))
          ) : (
            <p>No study materials available.</p>
          )}
        </div>
      )}
    </div>
  );
}

export default Learning;