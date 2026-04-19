import { useState } from "react";
import { useNavigate, Link } from "react-router";
import "./Register.css";

export default function Register() {
  const [form, setForm] = useState({
    name: "",
    surname: "",
    email: "",
    birthDate: "",
    password: "",
  });

  const [avatarFile, setAvatarFile] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleFileChange = (e) => {
    setAvatarFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", form.name);
    formData.append("surname", form.surname);
    formData.append("email", form.email);
    formData.append("birthDate", form.birthDate);
    formData.append("password", form.password);

    if (avatarFile) {
      formData.append("avatar", avatarFile);
    }

    try {
      const response = await fetch("${import.meta.env.VITE_API_URL}/authors", {
        method: "POST",

        body: formData,
      });

      if (response.ok) {
        alert("Registrazione completata con successo!");
        navigate("/login");
      } else {
        const errorData = await response.json();
        alert("Errore: " + (errorData.message || "Impossibile registrarsi"));
      }
    } catch (err) {
      console.error(err);
      alert("Errore di connessione al server.");
    }
  };

  return (
    <div className="register-container">
      <div className="register-card">
        <div className="register-side-info d-none d-md-flex">
          <i className="bi bi-person-plus-fill" style={{ fontSize: "4rem" }}></i>
          <h1 className="mt-3">Unisciti a noi</h1>
          <p className="opacity-75">Crea il tuo profilo autore e inizia a condividere le tue idee.</p>
        </div>

        <div className="register-side-form">
          <div className="register-header mb-4">
            <h2>Crea Account</h2>
            <p className="text-muted">Inserisci i tuoi dati e carica una foto profilo.</p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="row">
              <div className="col-md-6 mb-3">
                <div className="form-floating">
                  <input className="form-control" name="name" id="regName" placeholder="Nome" onChange={handleChange} required />
                  <label htmlFor="regName">Nome</label>
                </div>
              </div>
              <div className="col-md-6 mb-3">
                <div className="form-floating">
                  <input className="form-control" name="surname" id="regSurname" placeholder="Cognome" onChange={handleChange} required />
                  <label htmlFor="regSurname">Cognome</label>
                </div>
              </div>
            </div>

            <div className="form-floating mb-3">
              <input className="form-control" name="email" type="email" id="regEmail" placeholder="Email" onChange={handleChange} required />
              <label htmlFor="regEmail">Indirizzo Email</label>
            </div>

            <div className="row">
              <div className="col-md-6 mb-3">
                <div className="form-floating">
                  <input className="form-control" name="birthDate" type="date" id="regDate" placeholder="Data di nascita" onChange={handleChange} required />
                  <label htmlFor="regDate">Data di nascita</label>
                </div>
              </div>
              <div className="col-md-6 mb-3">
                <div className="form-floating">
                  <input className="form-control" name="password" type="password" id="regPass" placeholder="Password" onChange={handleChange} required />
                  <label htmlFor="regPass">Password</label>
                </div>
              </div>
            </div>

            <div className="mb-4">
              <label htmlFor="regAvatar" className="form-label text-muted small fw-bold">
                Foto Profilo (Avatar)
              </label>
              <input className="form-control" name="avatar" type="file" id="regAvatar" accept="image/*" onChange={handleFileChange} />
            </div>

            <button className="btn btn-success w-100 btn-register mb-3">Registrati</button>
          </form>

          <p className="text-center mb-0">
            Hai già un account?{" "}
            <Link to="/login" className="text-decoration-none fw-bold text-success">
              Accedi qui
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
