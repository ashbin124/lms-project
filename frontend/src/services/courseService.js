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
