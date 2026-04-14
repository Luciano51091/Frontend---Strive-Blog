import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router";

export default function Home() {
  const [posts, setPosts] = useState([]);
  const [me, setMe] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPosts = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      try {
        const response = await fetch(`http://localhost:3000/blogPosts?page=${page}&limit=6`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const meResponse = await fetch("http://localhost:3000/auth/me", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.ok && meResponse.ok) {
          const data = await response.json();
          const meData = await meResponse.json();

          setPosts(data.posts);
          setTotalPages(data.totalPages);
          setMe(meData);
        } else {
          localStorage.removeItem("token");
          navigate("/login");
        }
      } catch (error) {
        console.error("Errore caricamento post:", error);
      }
    };

    fetchPosts();
  }, [navigate, page]);

  // FUNZIONE PER ELIMINARE IL POST
  const handleDelete = async (postId) => {
    if (!window.confirm("Sei sicuro di voler eliminare questo post?")) return;

    const token = localStorage.getItem("token");

    try {
      const response = await fetch(`http://localhost:3000/blogPosts/${postId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        setPosts(posts.filter((post) => post._id !== postId));
        alert("Post eliminato con successo!");
      } else {
        const errorData = await response.json();
        alert(errorData.message || "Errore durante l'eliminazione");
      }
    } catch (error) {
      console.error("Errore delete:", error);
    }
  };

  return (
    <div className="container mt-5">
      <div className="d-flex justify-content-between align-items-center">
        <h1>Benvenuto su Strive Blog</h1>
        <Link to="/create" className="btn btn-success">
          Nuovo Post
        </Link>
      </div>

      <div className="row mt-4">
        {posts.map((post) => (
          <div key={post._id} className="col-md-4 mb-3">
            <div className="card h-100 shadow-sm">
              <img
                src={post.cover}
                className="card-img-top"
                alt={post.title}
                style={{ height: "200px", objectFit: "cover" }}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "https://placehold.co/400x200?text=No+Cover";
                }}
              />
              <div className="card-body d-flex flex-column">
                <h5 className="card-title text-primary">{post.title}</h5>
                <p className="card-text text-muted flex-grow-1">{post.content.substring(0, 100)}...</p>

                <div className="d-flex justify-content-between align-items-center mt-3">
                  <Link to={`/blogPosts/${post._id}`} className="btn btn-primary btn-sm">
                    Read more
                  </Link>

                  {me && post.author === me.email && (
                    <div className="d-flex align-items-center gap-3">
                      <Link to={`/edit/${post._id}`} className="text-warning d-inline-flex align-items-center" style={{ textDecoration: "none" }}>
                        <i className="bi bi-pencil fs-5" title="Modifica post"></i>
                      </Link>
                      <i
                        className="bi bi-trash3 text-danger fs-5"
                        onClick={() => handleDelete(post._id)}
                        style={{ cursor: "pointer" }}
                        title="Elimina post"
                      ></i>
                    </div>
                  )}
                </div>
                <div className="mt-3 pt-2 border-top">
                  <small className="text-muted d-block">Categoria: {post.category}</small>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="d-flex justify-content-center align-items-center gap-3 mt-4 mb-5">
        <button className="btn btn-outline-primary" disabled={page === 1} onClick={() => setPage(page - 1)}>
          Precedente
        </button>

        <span>
          Pagina <strong>{page}</strong> di {totalPages}
        </span>

        <button className="btn btn-outline-primary" disabled={page === totalPages} onClick={() => setPage(page + 1)}>
          Successiva
        </button>
      </div>
    </div>
  );
}
