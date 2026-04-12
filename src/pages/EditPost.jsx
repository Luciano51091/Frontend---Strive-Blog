import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";

export default function EditPost() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({ title: "", category: "", content: "" });

  useEffect(() => {
    // Carichiamo i dati attuali del post per popolare il form
    const fetchPost = async () => {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:3000/blogPosts/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setForm({ title: data.title, category: data.category, content: data.content });
      }
    };
    fetchPost();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`http://localhost:3000/blogPosts/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        alert("Post aggiornato!");
        navigate("/homepage");
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="container mt-5">
      <h2>Modifica Post</h2>
      <form onSubmit={handleSubmit} className="card p-4 shadow">
        <div className="mb-3">
          <label className="form-label">Titolo</label>
          <input className="form-control" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
        </div>
        <div className="mb-3">
          <label className="form-label">Contenuto</label>
          <textarea className="form-control" rows="5" value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} />
        </div>
        <button type="submit" className="btn btn-warning">
          Salva Modifiche
        </button>
      </form>
    </div>
  );
}
