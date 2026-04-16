import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router";
import { useSearchParams } from "react-router";
import "./Login.css";

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
  }, [searchParams, navigate]);

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
    <div className="login-container">
      <div className="login-card">
        <div className="login-side-info d-none d-md-flex">
          <i className="bi bi-journal-text" style={{ fontSize: "4rem" }}></i>
          <h1 className="mt-3">Strive Blog</h1>
          <p className="opacity-75">La tua community di tech & lifestyle preferita.</p>
        </div>

        <div className="login-side-form">
          <div className="login-header mb-4">
            <h2>Bentornato!</h2>
            <p className="text-muted">Inserisci le tue credenziali per accedere.</p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="form-floating mb-3">
              <input name="email" type="email" className="form-control" id="floatingEmail" placeholder="name@example.com" onChange={handleChange} required />
              <label htmlFor="floatingEmail">Indirizzo Email</label>
            </div>

            <div className="form-floating mb-3">
              <input name="password" type="password" className="form-control" id="floatingPassword" placeholder="Password" onChange={handleChange} required />
              <label htmlFor="floatingPassword">Password</label>
            </div>

            <button type="submit" className="btn btn-primary w-100 btn-login mb-3">
              Accedi ora
            </button>
          </form>

          <div className="text-center my-3">
            <span className="text-muted">oppure</span>
          </div>

          <button onClick={handleGoogleLogin} className="btn btn-google w-100 d-flex align-items-center justify-content-center gap-2 mb-4">
            <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" style={{ width: "18px" }} />
            Continua con Google
          </button>

          <p className="text-center mb-0">
            Non hai ancora un account?{" "}
            <Link to="/register" className="text-decoration-none fw-bold">
              Registrati qui
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
