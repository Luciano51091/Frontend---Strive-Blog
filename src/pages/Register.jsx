import { useState } from "react";
import { useNavigate } from "react-router";

export default function Register() {
  const [form, setForm] = useState({ name: "", surname: "", email: "", birthDate: "", avatar: "", password: "" });
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:3000/authors", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (response.ok) {
        alert("Registrazione completata!");
        navigate("/login");
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="container mt-5">
      <h2>Registrazione</h2>
      <form onSubmit={handleSubmit}>
        <input className="form-control mb-2" name="name" placeholder="Nome" onChange={handleChange} />
        <input className="form-control mb-2" name="surname" placeholder="Cognome" onChange={handleChange} />
        <input className="form-control mb-2" name="email" type="email" placeholder="Email" onChange={handleChange} />
        <input className="form-control mb-2" name="birthDate" type="date" placeholder="BirthDate" onChange={handleChange} />
        <input className="form-control mb-2" name="avatar" type="file" placeholder="Avatar" onChange={handleChange} />
        <input className="form-control mb-2" name="password" type="password" placeholder="Password" onChange={handleChange} />
        <button className="btn btn-success">Crea Account</button>
      </form>
    </div>
  );
}
