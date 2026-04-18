import { useEffect, useState } from "react";
import { useNavigate, Link, useLocation } from "react-router";

export default function Home() {
  const [posts, setPosts] = useState([]);
  const [me, setMe] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const searchTerm = query.get("title") || "";

  const fetchPosts = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(`http://localhost:3000/blogPosts?page=${page}&limit=6&title=${searchTerm}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const meResponse = await fetch("http://localhost:3000/auth/me", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok && meResponse.ok) {
        const data = await response.json();
        const meData = await meResponse.json();

        setPosts(data.posts || []);
        setTotalPages(data.totalPages || 1);
        setMe(meData);
      } else {
        localStorage.removeItem("token");
        navigate("/login");
      }
    } catch (error) {
      console.error("Errore caricamento post:", error);
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    fetchPosts();
  }, [navigate, page, searchTerm]);

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
        fetchPosts();
      } else {
        const errorData = await response.json();
        alert(errorData.message || "Errore durante l'eliminazione");
      }
    } catch (error) {
      console.error("Errore delete:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: "80vh" }}>
        <div className="spinner-border text-primary" role="status" style={{ width: "3rem", height: "3rem" }}>
          <span className="visually-hidden">Caricamento...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-5">
      <div className="d-flex justify-content-between align-items-center">
        <h1>{searchTerm ? `Risultati per: "${searchTerm}"` : "Benvenuto su Strive Blog"}</h1>
        <Link to="/create" className="btn btn-success rounded-pill px-4">
          <i className="bi bi-plus-lg me-2"></i>Nuovo Post
        </Link>
      </div>

      <div className="row mt-4">
        {posts.length > 0 ? (
          posts.map((post) => (
            <div key={post._id} className="col-md-4 mb-4">
              <div className="card h-100 shadow-sm border-0 rounded-4 overflow-hidden">
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
                  <h5 className="card-title text-primary fw-bold">{post.title}</h5>
                  <p className="card-text text-muted flex-grow-1">{post.content.substring(0, 100)}...</p>

                  <div className="d-flex justify-content-between align-items-center mt-3">
                    <Link to={`/blogPosts/${post._id}`} className="btn btn-outline-primary btn-sm rounded-pill px-3">
                      Leggi di più
                    </Link>
                    <div className=" pt-2 ">
                      <span className="badge rounded-pill bg-outline-info text-primary">{post.category}</span>
                    </div>

                    {me && (post.author?._id === me._id || post.author === me._id) && (
                      <div className="d-flex align-items-center gap-3">
                        <Link to={`/edit/${post._id}`} className="text-warning">
                          <i className="bi bi-pencil fs-5"></i>
                        </Link>
                        <i className="bi bi-trash3 text-danger fs-5" onClick={() => handleDelete(post._id)} style={{ cursor: "pointer" }}></i>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center mt-5">
            <h3>Nessun post trovato {searchTerm && `per "${searchTerm}"`}</h3>
          </div>
        )}
      </div>

      {totalPages > 1 && (
        <div className="d-flex justify-content-center align-items-center gap-3 mt-4 mb-5">
          <button className="btn btn-sm btn-outline-primary rounded-circle" disabled={page === 1} onClick={() => setPage(page - 1)}>
            <i className="bi bi-chevron-left"></i>
          </button>
          <span>
            Pagina <strong>{page}</strong> di {totalPages}
          </span>
          <button className="btn btn-sm btn-outline-primary rounded-circle" disabled={page === totalPages} onClick={() => setPage(page + 1)}>
            <i className="bi bi-chevron-right"></i>
          </button>
        </div>
      )}
    </div>
  );
}
