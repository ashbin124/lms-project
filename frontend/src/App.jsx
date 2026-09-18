import Login from "./pages/Login";
import Register from "./pages/Register";
import { Routes, Route } from "react-router-dom";
import StudentDashboard from "./pages/StudentDashboard";
import InstructorDashboard from "./pages/InstructorDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {

  return (
    <Routes>
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

        path="/admin/dashboard"
        element={
          <ProtectedRoute allowedRole="ADMIN">
            <AdminDashboard />
          </ProtectedRoute>

        }

      />

      
    </Routes>
  );
}

export default App;