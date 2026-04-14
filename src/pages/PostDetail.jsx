import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";

export default function PostDetail() {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [me, setMe] = useState(null);
  const [newComment, setNewComment] = useState("");
  const navigate = useNavigate();
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editText, setEditText] = useState("");

  useEffect(() => {
    const fetchPost = async () => {
      const token = localStorage.getItem("token");
      try {
        const res = await fetch(`http://localhost:3000/blogPosts/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const meRes = await fetch("http://localhost:3000/auth/me", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.ok && meRes.ok) {
          const data = await res.json();
          const meData = await meRes.json();
          setPost(data);
          setMe(meData);
        } else {
          navigate("/homepage");
        }
      } catch (err) {
        console.error(err);
      }
    };

    fetchPost();
  }, [id, navigate]);

  // FUNZIONE PER INVIARE IL COMMENTO
  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    try {
      const res = await fetch(`http://localhost:3000/blogPosts/${id}/comments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ text: newComment }),
      });

      if (res.ok) {
        const updatedComments = await res.json();

        setPost({ ...post, comments: updatedComments });
        setNewComment("");
      } else {
        alert("Errore durante l'invio del commento");
      }
    } catch (err) {
      console.error("Errore invio commento:", err);
    }
  };

  // Funzione per inviare la modifica al backend
  const handleUpdateComment = async (commentId) => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`http://localhost:3000/blogPosts/${id}/comments/${commentId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ text: editText }),
      });

      if (res.ok) {
        const updatedComments = await res.json();
        setPost({ ...post, comments: updatedComments });
        setEditingCommentId(null);
      }
    } catch (err) {
      console.error("Errore modifica:", err);
    }
  };

  //FUNZIONE PER CANCELLARE UN COMMENTO

  const handleDeleteComment = async (commentId) => {
    if (!window.confirm("Sei sicuro di voler eliminare questo commento?")) return;

    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`http://localhost:3000/blogPosts/${id}/comments/${commentId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        const updatedComments = await res.json();

        setPost({ ...post, comments: updatedComments });
      } else {
        alert("Errore durante l'eliminazione del commento");
      }
    } catch (err) {
      console.error("Errore delete comment:", err);
    }
  };

  if (!post) return <div className="container mt-5">Caricamento...</div>;

  return (
    <div className="container mt-5 mb-5">
      <button onClick={() => navigate(-1)} className="btn btn-outline-secondary mb-4">
        ← Torna indietro
      </button>

      <article>
        <img src={post.cover} alt={post.title} className="img-fluid rounded shadow mb-4" style={{ width: "100%", maxHeight: "500px", objectFit: "cover" }} />
        <h1 className="display-4">{post.title}</h1>
        <div className="d-flex gap-2 mb-4 text-muted">
          <span>
            Categoria: <strong>{post.category}</strong>
          </span>{" "}
          |
          <span>
            Autore: <strong>{post.author}</strong>
          </span>
        </div>
        <hr />
        <p style={{ whiteSpace: "pre-wrap", fontSize: "1.2rem" }}>{post.content}</p>
      </article>

      <hr className="my-5" />

      <section className="comments-section">
        <h3>Commenti ({post.comments?.length || 0})</h3>

        <form onSubmit={handleCommentSubmit} className="mt-4 mb-5">
          <div className="mb-3">
            <textarea
              className="form-control"
              rows="3"
              placeholder="Cosa ne pensi? Lascia un commento..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              required
            ></textarea>
          </div>
          <button type="submit" className="btn btn-primary">
            Invia commento
          </button>
        </form>

        <div className="comments-list">
          {post.comments && post.comments.length > 0 ? (
            post.comments.map((comment) => (
              <div key={comment._id} className="card mb-3 shadow-sm">
                <div className="card-body">
                  <div className="d-flex justify-content-between mb-2">
                    <strong className="text-primary">{comment.author}</strong>
                    <div className="d-flex align-items-center gap-2">
                      <small className="text-muted">{new Date(comment.createdAt).toLocaleDateString()}</small>

                      {/* MOSTRA ICONA MODIFICA SOLO SE SEI L'AUTORE */}
                      {me && comment.author === me.email && (
                        <div className="d-flex gap-2">
                          <i
                            className="bi bi-pencil text-warning"
                            style={{ cursor: "pointer" }}
                            onClick={() => {
                              setEditingCommentId(comment._id);
                              setEditText(comment.text);
                            }}
                            title="Modifica commento"
                          ></i>

                          <i
                            className="bi bi-trash3 text-danger"
                            style={{ cursor: "pointer" }}
                            onClick={() => handleDeleteComment(comment._id)}
                            title="Elimina commento"
                          ></i>
                        </div>
                      )}
                    </div>
                  </div>

                  {editingCommentId === comment._id ? (
                    // INTERFACCIA DI MODIFICA
                    <div className="mt-2">
                      <textarea className="form-control mb-2" value={editText} onChange={(e) => setEditText(e.target.value)} />
                      <div className="d-flex gap-2">
                        <button className="btn btn-success btn-sm" onClick={() => handleUpdateComment(comment._id)}>
                          Salva
                        </button>
                        <button className="btn btn-outline-secondary btn-sm" onClick={() => setEditingCommentId(null)}>
                          Annulla
                        </button>
                      </div>
                    </div>
                  ) : (
                    // VISUALIZZAZIONE NORMALE
                    <p className="card-text">{comment.text}</p>
                  )}
                </div>
              </div>
            ))
          ) : (
            <p className="text-muted italic">Ancora nessun commento. Sii il primo!</p>
          )}
        </div>
      </section>
    </div>
  );
}
