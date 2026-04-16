import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import "./Profile.css";

export default function Profile() {
  const [me, setMe] = useState(null);
  const [myPosts, setMyPosts] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [avatarFile, setAvatarFile] = useState(null);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    surname: "",
    birthDate: "",
  });

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchMeAndPosts = async () => {
      try {
        const res = await fetch("http://localhost:3000/auth/me", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const resPosts = await fetch("http://localhost:3000/blogPosts/me", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.ok && resPosts.ok) {
          const data = await res.json();
          const postsData = await resPosts.json();

          setMe(data);
          setMyPosts(postsData);
          setFormData({
            name: data.name,
            surname: data.surname,
            birthDate: data.birthDate?.split("T")[0] || "",
          });
        }
      } catch (err) {
        console.error("Errore recupero dati:", err);
      }
    };
    fetchMeAndPosts();
  }, [token]);

  const handleUpdateInfo = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`http://localhost:3000/authors/${me._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        const updated = await res.json();
        setMe(updated);
        setIsEditing(false);
        alert("Profilo aggiornato!");
      }
    } catch (err) {
      console.error(err);
    }
  };
  // MODIFICA ACCOUNT
  const handleAvatarUpload = async () => {
    if (!avatarFile) return;
    const uploadData = new FormData();
    uploadData.append("avatar", avatarFile);

    try {
      const res = await fetch(`http://localhost:3000/authors/${me._id}/avatar`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}` },
        body: uploadData,
      });
      if (res.ok) {
        const updated = await res.json();
        setMe(updated);
        setAvatarFile(null);
        alert("Avatar caricato con successo!");
      }
    } catch (err) {
      console.error(err);
    }
  };
  // ELIMINAZIONE ACCOUNT
  const handleDeleteAccount = async () => {
    if (!me || !me._id) {
      alert("Errore: dati utente non caricati. Riprova tra un istante.");
      return;
    }

    const confirmDelete = window.confirm("ATTENZIONE: Eliminando il tuo account, verranno cancellati PER SEMPRE anche tutti i tuoi articoli. Vuoi procedere?");

    if (confirmDelete) {
      try {
        const res = await fetch(`http://localhost:3000/authors/${me._id}`, {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.ok) {
          alert("Account e contenuti eliminati. Ci dispiace vederti andare via!");
          localStorage.removeItem("token");
          navigate("/login");
        } else {
          const errorData = await res.json();
          alert(errorData.message || "Errore durante l'eliminazione.");
        }
      } catch (err) {
        console.error("Errore delete:", err);
        alert("Errore di connessione.");
      }
    }
  };

  // ELIMINAZIONE SINGOLO POST
  const handleDeletePost = async (postId) => {
    const confirmDelete = window.confirm("Sei sicuro di voler eliminare questo articolo?");

    if (confirmDelete) {
      try {
        const res = await fetch(`http://localhost:3000/blogPosts/${postId}`, {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.ok) {
          setMyPosts(myPosts.filter((post) => post._id !== postId));
          alert("Post eliminato correttamente.");
        } else {
          alert("Errore durante l'eliminazione del post.");
        }
      } catch (err) {
        console.error("Errore delete post:", err);
      }
    }
  };

  if (!me) return <div className="container mt-5">Caricamento profilo...</div>;

  return (
    <div className="profile-container pb-5">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-6">
            <div className="card profile-card shadow">
              <div className="profile-header-custom">
                <h2 className="fw-bold">Bentornato, {me.name}!</h2>
                <p className="opacity-75">Gestisci le tue informazioni personali</p>
              </div>

              <div className="card-body p-4 text-center">
                <div className="avatar-wrapper mb-4">
                  <img src={me.avatar} alt="Avatar" className="rounded-circle profile-avatar" />
                  <label htmlFor="avatar-input" className="upload-label">
                    <i className="bi bi-camera-fill text-primary"></i>
                  </label>
                  <input id="avatar-input" type="file" hidden onChange={(e) => setAvatarFile(e.target.files[0])} />
                </div>

                {avatarFile && (
                  <div className="alert alert-info py-2 small d-flex align-items-center justify-content-between">
                    <span>Nuova immagine selezionata!</span>
                    <button onClick={handleAvatarUpload} className="btn btn-sm btn-success">
                      Carica
                    </button>
                  </div>
                )}

                {!isEditing ? (
                  <div className="text-start mt-4">
                    <div className="info-group">
                      <span className="info-label">Nome Completo</span>
                      <span className="info-value">
                        {me.name} {me.surname}
                      </span>
                    </div>
                    <div className="info-group">
                      <span className="info-label">Email</span>
                      <span className="info-value">{me.email}</span>
                    </div>
                    <div className="info-group">
                      <span className="info-label">Data di Nascita</span>
                      <span className="info-value">{new Date(me.birthDate).toLocaleDateString()}</span>
                    </div>
                    <button onClick={() => setIsEditing(true)} className="btn btn-primary w-100 mt-3 rounded-pill py-2">
                      <i className="bi bi-pencil-square me-2"></i> Modifica Profilo
                    </button>
                    {!isEditing && (
                      <div className="mt-5 pt-3 border-top">
                        <p className="text-muted small">!! ATTENZIONE !!</p>
                        <button onClick={handleDeleteAccount} className="btn btn-outline-danger btn-sm w-100 rounded-pill">
                          <i className="bi bi-exclamation-triangle me-2"></i>
                          Elimina Account Definitivamente
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <form onSubmit={handleUpdateInfo} className="text-start mt-4">
                    <div className="mb-3">
                      <label className="form-label small fw-bold">Nome</label>
                      <input
                        type="text"
                        className="form-control rounded-pill"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label small fw-bold">Cognome</label>
                      <input
                        type="text"
                        className="form-control rounded-pill"
                        value={formData.surname}
                        onChange={(e) => setFormData({ ...formData, surname: e.target.value })}
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label small fw-bold">Data di Nascita</label>
                      <input
                        type="date"
                        className="form-control rounded-pill"
                        value={formData.birthDate}
                        onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })}
                      />
                    </div>
                    <div className="d-flex gap-2">
                      <button type="submit" className="btn btn-success flex-grow-1 rounded-pill">
                        Salva
                      </button>
                      <button type="button" onClick={() => setIsEditing(false)} className="btn btn-light flex-grow-1 rounded-pill">
                        Annulla
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* SEZIONE MIEI POST */}
        <div className="row justify-content-center mt-5">
          <div className="col-md-10">
            <h3 className="mb-4 fw-bold text-secondary">I miei articoli ({myPosts.length})</h3>
            <div className="row">
              {myPosts.length > 0 ? (
                myPosts.map((post) => (
                  <div key={post._id} className="col-md-4 mb-4">
                    <div className="card h-100 shadow-sm border-0 rounded-4 overflow-hidden">
                      <img src={post.cover} className="card-img-top" alt={post.title} style={{ height: "150px", objectFit: "cover" }} />
                      <div className="card-body">
                        <h5 className="card-title text-truncate">{post.title}</h5>
                        <div className="d-flex gap-2 justify-content-between align-items-center mt-3">
                          <div className="d-flex gap-2">
                            <button onClick={() => navigate(`/blogPosts/${post._id}`)} className="btn btn-sm btn-outline-primary" title="Visualizza">
                              <i className="bi bi-eye"></i>
                            </button>
                            <button onClick={() => navigate(`/edit/${post._id}`)} className="btn btn-sm btn-outline-warning" title="Modifica">
                              <i className="bi bi-pencil"></i>
                            </button>
                          </div>

                          {/* NUOVO TASTO ELIMINA */}
                          <button onClick={() => handleDeletePost(post._id)} className="btn btn-sm btn-outline-danger" title="Elimina">
                            <i className="bi bi-trash"></i>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center p-5 bg-white rounded-4 shadow-sm w-100">
                  <p className="text-muted">Non hai ancora scritto nessun post.</p>
                  <button onClick={() => navigate("/create")} className="btn btn-primary rounded-pill">
                    Crea il tuo primo articolo
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
