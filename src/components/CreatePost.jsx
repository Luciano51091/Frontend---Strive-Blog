import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import "./CreatePost.css";

export default function CreatePost() {
  const [form, setForm] = useState({
    title: "",
    category: "",
    content: "",
    readTime: { value: 1, unit: "minutes" },
  });

  const [cover, setCover] = useState(null);
  const [preview, setPreview] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!cover) {
      setPreview(null);
      return;
    }
    const objectUrl = URL.createObjectURL(cover);
    setPreview(objectUrl);

    return () => URL.revokeObjectURL(objectUrl);
  }, [cover]);

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
      const res = await fetch("${import.meta.env.VITE_API_URL}/blogPosts", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (res.ok) {
        navigate("/homepage");
      }
    } catch (err) {
      console.error("Errore creazione post", err);
    }
  };

  return (
    <div className="create-post-container">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-8">
            <div className="create-post-card">
              <div className="create-post-header">
                <h2>Crea un nuovo articolo</h2>
                <p className="mb-0 opacity-75">Condividi le tue conoscenze con la community</p>
              </div>

              <div className="create-post-body">
                <form onSubmit={handleSubmit}>
                  {/* Anteprima Immagine */}
                  <div className="image-preview-wrapper">
                    {preview ? (
                      <img src={preview} alt="Anteprima" />
                    ) : (
                      <div className="text-center text-muted">
                        <i className="bi bi-cloud-arrow-up d-block" style={{ fontSize: "2.5rem" }}></i>
                        <span>Nessuna immagine selezionata</span>
                      </div>
                    )}
                  </div>

                  <div className="mb-4">
                    <label className="form-label">Titolo dell'articolo</label>
                    <input name="title" className="form-control" placeholder="Inserisci un titolo accattivante..." onChange={handleChange} required />
                  </div>

                  <div className="row">
                    <div className="col-md-6 mb-4">
                      <label className="form-label">Categoria</label>
                      <input name="category" className="form-control" placeholder="Esempio: Tech, Food, Travel" onChange={handleChange} required />
                    </div>
                    <div className="col-md-6 mb-4">
                      <label className="form-label">Immagine di Copertina</label>
                      <input type="file" className="form-control" onChange={handleFileChange} accept="image/*" />
                    </div>
                  </div>

                  <div className="mb-4">
                    <label className="form-label">Contenuto</label>
                    <textarea name="content" className="form-control" rows="8" placeholder="Scrivi qui il tuo articolo..." onChange={handleChange} required />
                  </div>

                  <div className="mb-5">
                    <label className="form-label">Tempo di lettura stimato (minuti)</label>
                    <div className="input-group" style={{ maxWidth: "200px" }}>
                      <input name="readTimeValue" type="number" className="form-control" min="1" value={form.readTime.value} onChange={handleChange} />
                      <span className="input-group-text">min</span>
                    </div>
                  </div>

                  <button type="submit" className="btn btn-publish text-white w-100 shadow-sm">
                    Pubblica l'articolo
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
