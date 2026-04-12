import { useState } from "react";
import { useNavigate } from "react-router";

export default function CreatePost() {
  const [form, setForm] = useState({
    title: "",
    category: "",
    content: "",
    readTime: { value: 1, unit: "minutes" },
  });

  const [cover, setCover] = useState(null);

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "readTimeValue") {
      setForm({ ...form, readTime: { ...form.readTime, value: Number(value) } });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleFileChange = (e) => {
    setCover(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    const formData = new FormData();
    formData.append("title", form.title);
    formData.append("category", form.category);
    formData.append("content", form.content);
    formData.append("readTime[value]", form.readTime.value);
    formData.append("readTime[unit]", form.readTime.unit);

    if (cover) {
      formData.append("cover", cover);
    }

    try {
      const res = await fetch("http://localhost:3000/blogPosts", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (res.ok) {
        alert("Post creato con successo!");
        navigate("/homepage");
      }
    } catch (err) {
      console.error("Errore creazione post", err);
    }
  };

  return (
    <div className="container mt-5">
      <div className="card p-4 shadow">
        <h2>Crea un nuovo articolo</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Titolo</label>
            <input name="title" className="form-control" onChange={handleChange} required />
          </div>

          <div className="mb-3">
            <label className="form-label">Categoria</label>
            <input name="category" className="form-control" onChange={handleChange} required />
          </div>

          {/* CAMPO PER L'IMMAGINE */}
          <div className="mb-3">
            <label className="form-label">Immagine di Copertina</label>
            <input type="file" className="form-control" onChange={handleFileChange} accept="image/*" />
          </div>

          <div className="mb-3">
            <label className="form-label">Contenuto</label>
            <textarea name="content" className="form-control" rows="5" onChange={handleChange} required />
          </div>

          <div className="mb-3">
            <label className="form-label">Tempo di lettura (minuti)</label>
            <input name="readTimeValue" type="number" className="form-control" onChange={handleChange} />
          </div>

          <button type="submit" className="btn btn-success w-100">
            Pubblica
          </button>
        </form>
      </div>
    </div>
  );
}
