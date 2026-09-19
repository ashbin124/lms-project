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
import ProtectedRoute from "./components/ProtectedRoute";

function App() {

  return (
    <Routes>

      <Route path="/courses" element={<Courses />} />
      <Route 
        path="/courses/:courseId"
        element={<CourseDetails/>}
      />
      <Route path="/login" element={<Login/>}></Route>
      <Route path="/register" element={<Register/>}> </Route>
      <Route
        path="/student/dashboard"
        element={
         <ProtectedRoute allowedRole="STUDENT">
           <StudentDashboard />
         </ProtectedRoute>
        }
      />


      <Route
        path="/instructor/dashboard"
        element={
          <ProtectedRoute allowedRole="INSTRUCTOR">
            <InstructorDashboard/>
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
             <EditCourse/>
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
          <AdminCourses/>
        </ProtectedRoute>
       }
      />

      

      
    </Routes>
  );
}

export default App;