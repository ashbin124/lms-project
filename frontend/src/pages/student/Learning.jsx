import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import {
  getStudentLessons,
  getLessonProgress,
  markLessonComplete,
  markLessonIncomplete,
} from "../../services/courseService";


function Learning() {
  const { courseId } = useParams();

  const [lessons, setLessons] = useState([]);
  const [progress, setProgress] = useState([]);
  const [selectedLesson, setSelectedLesson] = useState(null);

  const [loading, setLoading] = useState(true);
  const [progressLoading, setProgressLoading] = useState(false);
  const [error, setError] = useState("");


  useEffect(() => {
    const loadLearningData = async () => {
      try {
        const [lessonData, progressData] = await Promise.all([
          getStudentLessons(),
          getLessonProgress(),
        ]);

        const courseLessons = lessonData
          .filter(
            (lesson) => lesson.course === Number(courseId)
          )
          .sort(
            (a, b) => a.order - b.order
          );

        const courseProgress = progressData.filter(
          (item) => item.course === Number(courseId)
        );

        setLessons(courseLessons);
        setProgress(courseProgress);

        if (courseLessons.length > 0) {
          setSelectedLesson(courseLessons[0]);
        }
      } catch {
        setError("Failed to load course learning data.");
      } finally {
        setLoading(false);
      }
    };

    loadLearningData();
  }, [courseId]);


  const getProgressRecord = (lessonId) => {
    return progress.find(
      (item) => item.lesson === lessonId
    );
  };


  const isLessonCompleted = (lessonId) => {
    return Boolean(
      getProgressRecord(lessonId)
    );
  };


  const completedLessons = progress.length;
  const totalLessons = lessons.length;

  const progressPercentage =
    totalLessons === 0
      ? 0
      : Math.round(
          (completedLessons / totalLessons) * 100
        );


  const handleMarkComplete = async () => {
    if (!selectedLesson) {
      return;
    }

    try {
      setProgressLoading(true);
      setError("");

      const newProgress = await markLessonComplete(
        selectedLesson.id
      );

      setProgress((currentProgress) => [
        ...currentProgress,
        newProgress,
      ]);
    } catch {
      setError("Failed to mark lesson as complete.");
    } finally {
      setProgressLoading(false);
    }
  };


  const handleMarkIncomplete = async () => {
    if (!selectedLesson) {
      return;
    }

    const progressRecord = getProgressRecord(
      selectedLesson.id
    );

    if (!progressRecord) {
      return;
    }

    try {
      setProgressLoading(true);
      setError("");

      await markLessonIncomplete(
        progressRecord.id
      );

      setProgress((currentProgress) =>
        currentProgress.filter(
          (item) => item.id !== progressRecord.id
        )
      );
    } catch {
      setError("Failed to mark lesson as incomplete.");
    } finally {
      setProgressLoading(false);
    }
  };


  const handleNextLesson = () => {
    if (!selectedLesson) {
      return;
    }

    const currentIndex = lessons.findIndex(
      (lesson) => lesson.id === selectedLesson.id
    );

    const nextLesson = lessons[currentIndex + 1];

    if (nextLesson) {
      setSelectedLesson(nextLesson);
    }
  };


  if (loading) {
    return <p>Loading lessons...</p>;
  }


  if (lessons.length === 0) {
    return (
      <div>
        <h1>Course Learning</h1>
        <p>No lessons are available for this course yet.</p>
      </div>
    );
  }


  const selectedLessonCompleted =
    selectedLesson &&
    isLessonCompleted(selectedLesson.id);

  const selectedLessonIndex =
    selectedLesson
      ? lessons.findIndex(
          (lesson) => lesson.id === selectedLesson.id
        )
      : -1;

  const hasNextLesson =
    selectedLessonIndex >= 0 &&
    selectedLessonIndex < lessons.length - 1;


  return (
    <div>
      <h1>Course Learning</h1>

      {error && <p>{error}</p>}

      <div>
        <h2>Course Progress</h2>

        <p>
          {completedLessons} of {totalLessons} lessons completed
        </p>

        <p>
          <strong>{progressPercentage}%</strong>
        </p>

        <div
          style={{
            width: "100%",
            maxWidth: "500px",
            height: "20px",
            backgroundColor: "#e5e7eb",
            borderRadius: "10px",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              width: `${progressPercentage}%`,
              height: "100%",
              backgroundColor: "#22c55e",
            }}
          />
        </div>

        {progressPercentage === 100 && (
          <p>
            🎉 Course Completed
          </p>
        )}
      </div>


      <div>
        <h2>Lessons</h2>

        {lessons.map((lesson) => {
          const completed = isLessonCompleted(
            lesson.id
          );

          return (
            <button
              key={lesson.id}
              onClick={() =>
                setSelectedLesson(lesson)
              }
            >
              {completed ? "✓ " : "○ "}
              {lesson.order}. {lesson.title}
            </button>
          );
        })}
      </div>


      {selectedLesson && (
        <div>
          <h2>
            {selectedLesson.title}
          </h2>

          {selectedLessonCompleted ? (
            <p>✓ Completed</p>
          ) : (
            <p>Not completed</p>
          )}


          {selectedLesson.video ? (
            <video
              controls
              width="700"
            >
              <source
                src={selectedLesson.video}
              />

              Your browser does not support the video tag.
            </video>
          ) : (
            <p>
              No video available for this lesson.
            </p>
          )}


          <p>
            {selectedLesson.content}
          </p>


          <h3>Study Materials</h3>

          {selectedLesson.materials?.length > 0 ? (
            selectedLesson.materials.map(
              (material) => (
                <div key={material.id}>
                  <span>
                    {material.title}
                  </span>{" "}

                  <a
                    href={material.file}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Open / Download
                  </a>
                </div>
              )
            )
          ) : (
            <p>
              No study materials available.
            </p>
          )}


          <div>
            {selectedLessonCompleted ? (
              <button
                onClick={
                  handleMarkIncomplete
                }
                disabled={progressLoading}
              >
                {progressLoading
                  ? "Updating..."
                  : "Mark Incomplete"}
              </button>
            ) : (
              <button
                onClick={
                  handleMarkComplete
                }
                disabled={progressLoading}
              >
                {progressLoading
                  ? "Updating..."
                  : "Mark Complete"}
              </button>
            )}


            {hasNextLesson && (
              <button
                onClick={
                  handleNextLesson
                }
              >
                Next Lesson →
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}


export default Learning;