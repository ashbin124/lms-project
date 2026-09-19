import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
  getInstructorCourse,
  getCategories,
  updateCourse,
} from "../../services/courseService";

function EditCourse() {
  const { courseId } = useParams();
  const navigate = useNavigate();

  const [course, setCourse] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [level, setLevel] = useState("");
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadCourse = async () => {
      try {
        const data = await getInstructorCourse(courseId);
        setCourse(data);

        setTitle(data.title);
        setDescription(data.description);
        setCategory(data.category);
        setLevel(data.level);

        const categoryData = await getCategories();
        setCategories(categoryData);
      } catch (error) {
        setError("Failed to load course.");
      } finally {
        setLoading(false);
      }
    };

    loadCourse();
  }, [courseId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const courseData = {
        title,
        description,
        category,
        level,
      };

      await updateCourse(courseId, courseData);

      navigate("/instructor/courses");
    } catch (error) {
      setError("Failed to update course.");
    }
  };

  if (loading) {
    return <p>Loading course...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div>
      <h1>Edit Course</h1>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          required
        >
          {categories.map((item) => (
            <option key={item.id} value={item.id}>
              {item.name}
            </option>
          ))}
        </select>

        <select
          value={level}
          onChange={(e) => setLevel(e.target.value)}
        >
          <option value="BEGINNER">Beginner</option>
          <option value="INTERMEDIATE">Intermediate</option>
          <option value="ADVANCED">Advanced</option>
        </select>

        <p>Status: {course.status}</p>

        <button type="submit">Save Changes</button>
      </form>
    </div>
  );
}

export default EditCourse;