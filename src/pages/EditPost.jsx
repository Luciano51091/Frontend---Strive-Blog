import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";

export default function EditPost() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({ title: "", category: "", content: "" });
  const [currentCover, setCurrentCover] = useState("");
  const [coverFile, setCoverFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await fetch(`http://localhost:3000/blogPosts/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const data = await res.json();
          setForm({
            title: data.title,
            category: data.category,
            content: data.content,
          });
          setCurrentCover(data.cover);
        }
      } catch (err) {
        console.error("Errore nel caricamento post:", err);
      }
    };
    fetchPost();
  }, [id, token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
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
        navigate("/homepage");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleCoverUpdate = async () => {
    if (!coverFile) return;
    setIsUploading(true);

    const formData = new FormData();
    formData.append("cover", coverFile);

    try {
      const res = await fetch(`http://localhost:3000/blogPosts/${id}/cover`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      if (res.ok) {
        navigate("/homepage");
      } else {
        const errorData = await res.json();
        alert(errorData.message || "Errore durante l'upload dell'immagine.");
      }
    } catch (err) {
      console.error("Errore upload cover:", err);
      alert("Si è verificato un errore durante il caricamento.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="container mt-5 mb-5">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <h2 className="mb-4">Modifica Post</h2>

          <div className="card shadow border-0 overflow-hidden">
            <div className="position-relative bg-light" style={{ minHeight: "300px" }}>
              {(currentCover || coverFile) && (
                <img
                  src={coverFile ? URL.createObjectURL(coverFile) : currentCover}
                  alt="Cover preview"
                  className="w-100"
                  style={{ height: "300px", objectFit: "cover" }}
                />
              )}

              <div className="card-img-overlay d-flex align-items-end p-3" style={{ background: "linear-gradient(transparent, rgba(0,0,0,0.6))" }}>
                <div className="w-100">
                  <label className="btn btn-light btn-sm rounded-pill mb-2">
                    <i className="bi bi-image me-2"></i>Sostituisci Immagine
                    <input type="file" hidden onChange={(e) => setCoverFile(e.target.files[0])} />
                  </label>
                  {coverFile && (
                    <button onClick={handleCoverUpdate} className="btn btn-success btn-sm rounded-pill mb-2 ms-2" disabled={isUploading}>
                      {isUploading ? "Caricamento..." : "Conferma Nuova Cover"}
                    </button>
                  )}
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="card-body p-4">
              <div className="mb-3">
                <label className="form-label fw-bold">Titolo</label>
                <input className="form-control rounded-3" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
              </div>

              <div className="mb-3">
                <label className="form-label fw-bold">Categoria</label>
                <input
                  className="form-control rounded-3"
                  placeholder="Es: Cinema, Musica, Scienza..."
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label fw-bold">Contenuto</label>
                <textarea
                  className="form-control rounded-3"
                  rows="8"
                  value={form.content}
                  onChange={(e) => setForm({ ...form, content: e.target.value })}
                  required
                />
              </div>

              <div className="d-flex gap-2">
                <button type="submit" className="btn btn-warning flex-grow-1 rounded-pill fw-bold">
                  Salva Modifiche Testuali
                </button>
                <button type="button" onClick={() => navigate("/homepage")} className="btn btn-light flex-grow-1 rounded-pill">
                  Annulla
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
