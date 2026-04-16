import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";

export default function Navbar() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setUser(null);
        return;
      }
      try {
        const res = await fetch("http://localhost:3000/auth/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const userData = await res.json();
          setUser(userData);
        } else {
          localStorage.removeItem("token");
          setUser(null);
        }
      } catch (err) {
        console.error("Errore nel recupero utente", err);
        setUser(null);
      }
    };

    fetchUser();
    window.addEventListener("loginSuccess", fetchUser);
    return () => window.removeEventListener("loginSuccess", fetchUser);
  }, []);

  const handleSearch = (e) => {
    navigate(`/homepage?title=${e.target.value}`);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
    navigate("/login");
  };

  const closeNavbar = () => {
    const navbar = document.getElementById("navbarContent");
    if (navbar && navbar.classList.contains("show")) {
      navbar.classList.remove("show");
    }
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark shadow-sm py-2">
      <div className="container-fluid px-4">
        <Link className="navbar-brand fw-bold text-white" to="/homepage" onClick={closeNavbar}>
          Strive Blog
        </Link>

        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarContent">
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarContent">
          <div className="mx-lg-auto my-2 my-lg-0 d-flex justify-content-center" style={{ width: "100%", maxWidth: "500px" }}>
            <div className="input-group">
              <span className="input-group-text bg-white border-0 rounded-start-pill">
                <i className="bi bi-search text-muted"></i>
              </span>
              <input type="text" className="form-control border-0 rounded-end-pill" placeholder="Cerca un post..." onChange={handleSearch} />
            </div>
          </div>

          <div className="navbar-nav ms-auto align-items-center gap-2">
            {user && (
              <>
                <span className="nav-item text-white d-none d-sm-inline me-2">
                  Ciao, <strong>{user.name}</strong>
                </span>

                {user.avatar && (
                  <img
                    src={user.avatar}
                    alt="avatar"
                    className="rounded-circle d-none d-md-block"
                    style={{ width: "35px", height: "35px", objectFit: "cover", border: "2px solid #0d6efd" }}
                  />
                )}

                <Link to="/profile" className="btn btn-sm btn-outline-light rounded-pill px-3" onClick={closeNavbar}>
                  Profilo
                </Link>

                <button
                  onClick={() => {
                    handleLogout();
                    closeNavbar();
                  }}
                  className="btn btn-sm btn-danger rounded-pill px-3"
                >
                  Logout
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
