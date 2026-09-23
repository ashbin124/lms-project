import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import { Routes, Route } from "react-router-dom";
import StudentDashboard from "./pages/student/StudentDashboard";
import InstructorDashboard from "./pages/instructor/InstructorDashboard";
import AdminDashboard from "./pages/admin/AdminDashboard";
import InstructorCourses from "./pages/instructor/InstructorCourses";
import CreateCourse from "./pages/instructor/CreateCourse";
import EditCourse from "./pages/instructor/EditCourse";
import AdminCourses from "./pages/admin/AdminCourses";
import Courses from "./pages/student/Courses";
import CourseDetails from "./pages/student/CourseDetails";
import MyCourses from "./pages/student/MyCourses";
import ManageLessons from "./pages/instructor/ManageLessons";
import CreateLesson from "./pages/instructor/CreateLesson";
import EditLesson from "./pages/instructor/EditLesson";
import AddMaterial from "./pages/instructor/AddMaterial";
import Learning from "./pages/student/Learning";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <Routes>
      <Route path="/courses" element={<Courses />} />
      <Route path="/courses/:courseId" element={<CourseDetails />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route
        path="/student/dashboard"
        element={
          <ProtectedRoute allowedRole="STUDENT">
            <StudentDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/student/my-courses"
        element={
          <ProtectedRoute allowedRole="STUDENT">
            <MyCourses />
          </ProtectedRoute>
        }
      />

      <Route
        path="/student/courses/:courseId/learn"
        element={
         <ProtectedRoute allowedRole="STUDENT">
           <Learning />
         </ProtectedRoute>
        }
      />

      <Route
        path="/instructor/dashboard"
        element={
          <ProtectedRoute allowedRole="INSTRUCTOR">
            <InstructorDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/instructor/courses"
        element={
          <ProtectedRoute allowedRole="INSTRUCTOR">
            <InstructorCourses />
          </ProtectedRoute>
        }
      />

      <Route
        path="/instructor/courses/create"
        element={
          <ProtectedRoute allowedRole="INSTRUCTOR">
            <CreateCourse />
          </ProtectedRoute>
        }
      />

      <Route
        path="/instructor/courses/:courseId/edit"
        element={
          <ProtectedRoute allowedRole="INSTRUCTOR">
            <EditCourse />
          </ProtectedRoute>
        }
      />

      <Route
        path="/instructor/courses/:courseId/lessons"
        element={
          <ProtectedRoute allowedRole="INSTRUCTOR">
            <ManageLessons />
          </ProtectedRoute>
        }
      />

      <Route
        path="/instructor/courses/:courseId/lessons/create"
        element={
          <ProtectedRoute allowedRole="INSTRUCTOR">
            <CreateLesson />
          </ProtectedRoute>
        }
      />

      <Route
       path="/instructor/courses/:courseId/lessons/:lessonId/edit"
       element={
        <ProtectedRoute allowedRole="INSTRUCTOR">
          <EditLesson/>
        </ProtectedRoute>
       }
      />

      <Route
        path="/instructor/courses/:courseId/lessons/:lessonId/materials/add"
        element={
          <ProtectedRoute allowedRole="INSTRUCTOR">
            <AddMaterial/>
          </ProtectedRoute>
      
        }
      />

      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute allowedRole="ADMIN">
            <AdminDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/courses"
        element={
          <ProtectedRoute allowedRole="ADMIN">
            <AdminCourses />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;