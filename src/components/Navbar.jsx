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
          console.log("Dati utente ricevuti:", userData);
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

    return () => {
      window.removeEventListener("loginSuccess", fetchUser);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
    navigate("/login");
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark px-4">
      <Link className="navbar-brand" to="/homepage">
        Strive Blog
      </Link>

      <div className="ms-auto d-flex align-items-center">
        {user && (
          <>
            {/* Aggiungiamo il link per creare un nuovo post */}
            <Link to="/create" className="btn btn-outline-light btn-sm me-3">
              Scrivi Post
            </Link>
            <span className="text-white me-3">
              Ciao, <strong>{user.name}</strong>!
            </span>
            {user.avatar && (
              <img src={user.avatar} alt="avatar" className="rounded-circle me-3" style={{ width: "35px", height: "35px", objectFit: "cover" }} />
            )}
            <button onClick={handleLogout} className="btn btn-outline-danger btn-sm">
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
}
