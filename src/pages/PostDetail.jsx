import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";

export default function PostDetail() {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPost = async () => {
      const token = localStorage.getItem("token");
      try {
        const res = await fetch(`http://localhost:3000/blogPosts/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const data = await res.json();
          setPost(data);
        } else {
          navigate("/homepage");
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchPost();
  }, [id, navigate]);

  if (!post) return <div className="container mt-5">Caricamento...</div>;

  return (
    <div className="container mt-5">
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
        <footer className="mt-5 text-muted">
          Tempo di lettura: {post.readTime?.value} {post.readTime?.unit}
        </footer>
      </article>
    </div>
  );
}
