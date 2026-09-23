import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  getInstructorLessons,
  deleteLesson,
  getStudyMaterials,
  deleteStudyMaterial,
} from "../../services/courseService";

function ManageLessons() {
  const { courseId } = useParams();

  const [lessons, setLessons] = useState([]);
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadLessons = async () => {
      try {
        const lessonData = await getInstructorLessons();
        const materialData = await getStudyMaterials();

        const courseLessons = lessonData.filter(
          (lesson) => lesson.course === Number(courseId)
        );

        setLessons(courseLessons);
        setMaterials(materialData);
      } catch {
        setError("Failed to load lessons.");
      } finally {
        setLoading(false);
      }
    };

    loadLessons();
  }, [courseId]);

  const handleDelete = async (lessonId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this lesson?"
    );

    if (!confirmed) return;

    try {
      await deleteLesson(lessonId);

      setLessons((currentLessons) =>
        currentLessons.filter((lesson) => lesson.id !== lessonId)
      );
    } catch {
      setError("Failed to delete lesson.");
    }
  };

  const handleMaterialDelete = async (materialId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this study material?"
    );

    if (!confirmed) return;

    try {
      await deleteStudyMaterial(materialId);

      setMaterials((currentMaterials) =>
        currentMaterials.filter(
          (material) => material.id !== materialId
        )
      );
    } catch {
      setError("Failed to delete study material.");
    }
  };

  if (loading) return <p>Loading lessons...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h1>Manage Lessons</h1>

      <Link to={`/instructor/courses/${courseId}/lessons/create`}>
        + ADD Lesson
      </Link>

      {lessons.length === 0 ? (
        <p>No lessons added yet.</p>
      ) : (
        lessons.map((lesson) => {
          const lessonMaterials = materials.filter(
            (material) => material.lesson === lesson.id
          );

          return (
            <div key={lesson.id}>
              <h2>{lesson.title}</h2>

              <p>{lesson.content}</p>

              <p>
                Video:{" "}
                {lesson.video
                  ? "Uploaded"
                  : "No video Uploaded"}
              </p>

              <h3>Study Materials</h3>

              {lessonMaterials.length === 0 ? (
                <p>No study materials added yet.</p>
              ) : (
                lessonMaterials.map((material) => (
                  <div key={material.id}>
                    <span>{material.title}</span>{" "}

                    <a
                      href={material.file}
                      target="_blank"
                      rel="noreferrer"
                    >
                      Open / Download
                    </a>{" "}

                    <button
                      onClick={() =>
                        handleMaterialDelete(material.id)
                      }
                    >
                      Delete Material
                    </button>
                  </div>
                ))
              )}

              <Link
                to={`/instructor/courses/${courseId}/lessons/${lesson.id}/edit`}
              >
                Edit Lesson
              </Link>

              <Link
                to={`/instructor/courses/${courseId}/lessons/${lesson.id}/materials/add`}
              >
                + ADD Material
              </Link>

              <button
                onClick={() => handleDelete(lesson.id)}
              >
                Delete Lesson
              </button>
            </div>
          );
        })
      )}
    </div>
  );
}

export default ManageLessons;