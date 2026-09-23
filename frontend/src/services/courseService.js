import api from "../api/axios";
export const getInstructorCourses = async () => {
    const response = await api.get("courses/");
    return response.data;
};
export const getInstructorCourse = async (courseId) => {
  const response = await api.get(`courses/${courseId}/`);
  return response.data;
};

export const getCategories = async () => {
    const response = await api.get("categories/");
    return response.data;
};

export const createCourse = async (courseData) => {
    const response = await api.post("courses/", courseData);
    return response.data;
};

export const updateCourse = async (courseId, courseData) => {
    const response = await api.patch(`courses/${courseId}/`, courseData);
    return response.data;
};

export const deleteCourse = async (courseId) => {
    await api.delete(`courses/${courseId}/`);
};
export const getAdminCourses = async () => {
  const response = await api.get("admin/courses/");
  return response.data;
};


export const approveCourse = async (courseId) => {
  const response = await api.post(
    `admin/courses/${courseId}/approve/`
  );
 
  return response.data;
};


export const rejectCourse = async (courseId) => {
  const response = await api.post(
    `admin/courses/${courseId}/reject/`
  );

  return response.data;
};


export const getPublicCourses = async () => {
  const response = await api.get("public/courses/");
  return response.data;
};


export const getPublicCourse = async (courseId) => {
  const response = await api.get(
    `public/courses/${courseId}/`
  );

  return response.data;
};
export const enrollInCourse = async (courseId) => {
  const response = await api.post("enrollments/", {
    course: courseId,
  });
  return response.data;
};

export const getMyEnrollments = async () => {
  const response = await api.get("enrollments/");
  return response.data;
};

export const getInstructorLessons = async () => {
  const response = await api.get("lessons/");
  return response.data;
};

export const createLesson = async (lessonData) => {
  const response = await api.post(
    "lessons/",
    lessonData
  );

  return response.data;
};

export const updateLesson = async (lessonId, lessonData) => {
  const response = await api.patch(
    `lessons/${lessonId}/`,
    lessonData
  );

  return response.data;
};

export const deleteLesson = async (lessonId) => {
  await api.delete(`lessons/${lessonId}/`);
};

export const getStudyMaterials = async () => {
  const response = await api.get("study-materials/");
  return response.data;
};

export const createStudyMaterial = async (materialData) => {
  const response = await api.post(
    "study-materials/",
    materialData
  );

  return response.data;
};

export const deleteStudyMaterial = async (materialId) => {
  await api.delete(`study-materials/${materialId}/`);
};

export const getStudentLessons = async () => {
  const response = await api.get("student/lessons/");
  return response.data;
};