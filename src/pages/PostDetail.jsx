import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import EmojiPicker from "emoji-picker-react";
import ReactMarkdown from "react-markdown";

export default function PostDetail() {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [me, setMe] = useState(null);
  const [newComment, setNewComment] = useState("");
  const navigate = useNavigate();
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editText, setEditText] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  useEffect(() => {
    const fetchPost = async () => {
      const token = localStorage.getItem("token");
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/blogPosts/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const meRes = await fetch("${import.meta.env.VITE_API_URL}/auth/me", {
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

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/blogPosts/${id}/comments`, {
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
      }
    } catch (err) {
      console.error(err);
    }
  };

  const onEmojiClick = (emojiData) => {
    setNewComment((prev) => prev + emojiData.emoji);
    setShowEmojiPicker(false);
  };

  const insertFormat = (tag) => {
    // Recuperiamo l'elemento textarea dal DOM
    const textarea = document.getElementById("commentArea");
    const start = textarea.selectionStart; // Inizio selezione mouse
    const end = textarea.selectionEnd; // Fine selezione mouse
    const text = textarea.value;

    // Testo evidenziato
    const selectedText = text.substring(start, end);

    // Se non c'è selezione, usiamo "testo", altrimenti usiamo la parola evidenziata
    const replacement = selectedText.length > 0 ? selectedText : "testo";

    const newText = text.substring(0, start) + tag + replacement + tag + text.substring(end);

    setNewComment(newText);

    // Riporta il focus sulla textarea
    textarea.focus();
  };

  const handleUpdateComment = async (commentId) => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/blogPosts/${id}/comments/${commentId}`, {
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
      console.error(err);
    }
  };

  const insertFormatEdit = (tag) => {
    const textarea = document.getElementById("editCommentArea");
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = editText;

    const selectedText = text.substring(start, end);
    const replacement = selectedText.length > 0 ? selectedText : "testo";

    const newText = text.substring(0, start) + tag + replacement + tag + text.substring(end);

    setEditText(newText);

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start, start + tag.length + replacement.length + tag.length);
    }, 0);
  };

  // Funzione specifica per le emoji in fase di modifica
  const onEmojiClickEdit = (emojiData) => {
    setEditText((prev) => prev + emojiData.emoji);
    setShowEmojiPicker(false);
  };

  const handleDeleteComment = async (commentId) => {
    if (!window.confirm("Sei sicuro?")) return;
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/blogPosts/${id}/comments/${commentId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const updatedComments = await res.json();
        setPost({ ...post, comments: updatedComments });
      }
    } catch (err) {
      console.error(err);
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
        <div className="text-muted mb-4">
          Categoria: <strong>{post.category}</strong> | Autore: <strong>{post.author}</strong>
        </div>
        <hr />
        <p style={{ whiteSpace: "pre-wrap", fontSize: "1.2rem" }}>{post.content}</p>
      </article>

      <hr className="my-5" />

      <section className="comments-section">
        <h3>Commenti ({post.comments?.length || 0})</h3>

        {/* FORM NUOVO COMMENTO */}
        <form onSubmit={handleCommentSubmit} className="mt-4 mb-5 shadow-sm p-3 bg-white rounded border">
          <div className="d-flex gap-2 mb-2">
            <button type="button" className="btn btn-sm btn-outline-secondary" onClick={() => insertFormat("**")} title="Grassetto">
              <i className="bi bi-type-bold"></i>
            </button>
            <button type="button" className="btn btn-sm btn-outline-secondary" onClick={() => insertFormat("*")} title="Corsivo">
              <i className="bi bi-type-italic"></i>
            </button>
            <div className="position-relative">
              <button type="button" className="btn btn-sm btn-outline-warning" onClick={() => setShowEmojiPicker(!showEmojiPicker)}>
                😀
              </button>
              {showEmojiPicker && (
                <div className="position-absolute z-3 mt-2">
                  <EmojiPicker onEmojiClick={onEmojiClick} />
                </div>
              )}
            </div>
          </div>
          <textarea
            id="commentArea"
            className="form-control mb-2"
            rows="3"
            placeholder="Scrivi un commento..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            required
          />
          <button type="submit" className="btn btn-primary btn-sm">
            Invia commento
          </button>
        </form>

        {/* LISTA COMMENTI */}
        <div className="comments-list">
          {post.comments && post.comments.length > 0 ? (
            post.comments.map((comment) => (
              <div key={comment._id} className="card mb-3 shadow-sm">
                <div className="card-body">
                  <div className="d-flex justify-content-between mb-2">
                    <strong className="text-primary">{comment.author}</strong>
                    <div className="d-flex align-items-center gap-2">
                      <small className="text-muted">{new Date(comment.createdAt).toLocaleDateString()}</small>
                      {me && comment.author === me.email && (
                        <div className="d-flex gap-2">
                          <i
                            className="bi bi-pencil text-warning"
                            style={{ cursor: "pointer" }}
                            onClick={() => {
                              setEditingCommentId(comment._id);
                              setEditText(comment.text);
                            }}
                          ></i>
                          <i className="bi bi-trash3 text-danger" style={{ cursor: "pointer" }} onClick={() => handleDeleteComment(comment._id)}></i>
                        </div>
                      )}
                    </div>
                  </div>

                  {editingCommentId === comment._id ? (
                    // INTERFACCIA DI MODIFICA POTENZIATA
                    <div className="mt-2 p-3 border rounded bg-light">
                      {/* Toolbar per l'Editing */}
                      <div className="d-flex gap-2 mb-2">
                        <button type="button" className="btn btn-sm btn-outline-secondary" onClick={() => insertFormatEdit("**")}>
                          <i className="bi bi-type-bold"></i>
                        </button>
                        <button type="button" className="btn btn-sm btn-outline-secondary" onClick={() => insertFormatEdit("*")}>
                          <i className="bi bi-type-italic"></i>
                        </button>
                        <div className="position-relative">
                          <button type="button" className="btn btn-sm btn-outline-warning" onClick={() => setShowEmojiPicker(!showEmojiPicker)}>
                            😀
                          </button>
                          {showEmojiPicker && (
                            <div className="position-absolute z-3 mt-2">
                              <EmojiPicker onEmojiClick={onEmojiClickEdit} />
                            </div>
                          )}
                        </div>
                      </div>

                      <textarea id="editCommentArea" className="form-control mb-2" value={editText} onChange={(e) => setEditText(e.target.value)} />

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
                    <div className="card-text">
                      <ReactMarkdown>{comment.text}</ReactMarkdown>
                    </div>
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
