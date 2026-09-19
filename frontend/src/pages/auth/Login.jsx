import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";

import AuthContext from "../../context/AuthContext";
import { getCurrentUser, loginUser } from "../../services/authService";


function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const { setUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const data = await loginUser(email, password);

      localStorage.setItem("access", data.access);
      localStorage.setItem("refresh", data.refresh);

      const user = await getCurrentUser();
      setUser(user);

      if (user.role === "STUDENT") {
        navigate("/student/dashboard");
      } else if (user.role === "INSTRUCTOR") {
        navigate("/instructor/dashboard");
      } else if (user.role === "ADMIN") {
        navigate("/admin/dashboard");
      }
    } catch (error) {
      if (error.response?.status === 401) {
        setError("Invalid email or password.");
      } else {
        setError("Something went wrong. Please try again.");
      }
    }
  };

  return (
    <div>
      <h1>Login</h1>

      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {error && <p>{error}</p>}

        <button type="submit">
          Login
        </button>
      </form>
    </div>
  );
}

export default Login;