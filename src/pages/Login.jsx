import { useEffect, useState } from "react";
import { useNavigate, Link, Navigate } from "react-router";
import { useSearchParams } from "react-router";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const token = searchParams.get("token");
    if (token) {
      localStorage.setItem("token", token);
      window.dispatchEvent(new Event("loginSuccess"));
      navigate("/homepage");
    }
  }, [searchParams, Navigate]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:3000/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem("token", data.token);
        window.dispatchEvent(new Event("loginSuccess"));
        navigate("/homepage");
      } else {
        alert("Credenziali errate");
      }
    } catch (error) {
      console.error("Errore durante il login:", error);
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = "http://localhost:3000/auth/google";
  };

  return (
    <div className="container mt-5">
      <h2>Accedi a Strive Blog</h2>
      <form onSubmit={handleSubmit} className="w-50">
        <div className="mb-3">
          <input name="email" type="email" className="form-control" placeholder="Email" onChange={handleChange} required />
        </div>
        <div className="mb-3">
          <input name="password" type="password" className="form-control" placeholder="Password" onChange={handleChange} required />
        </div>
        <button type="submit" className="btn btn-primary">
          Login
        </button>
      </form>
      <hr />
      <button onClick={handleGoogleLogin} className="btn btn-outline-dark w-50 d-flex align-items-center justify-content-center gap-2">
        <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" style={{ width: "20px" }} />
        Accedi con Google
      </button>
      <p className="mt-3">
        Non hai un account? <Link to="/register">Registrati qui</Link>
      </p>
    </div>
  );
}
