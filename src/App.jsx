import { BrowserRouter, Routes, Route, useLocation } from "react-router";
import Login from "./pages/Login";
import Register from "./pages/Register.jsx";
import Home from "./pages/Home.jsx";
import "bootstrap/dist/css/bootstrap.min.css";
import Navbar from "./components/Navbar.jsx";
import CreatePost from "./components/CreatePost.jsx";
import PostDetail from "./pages/PostDetail.jsx";
import EditPost from "./pages/EditPost.jsx";
import Profile from "./pages/Profile.jsx";

function NavbarWrapper() {
  const location = useLocation();

  const noNavbarPaths = ["/", "/login", "/register"];

  if (noNavbarPaths.includes(location.pathname)) {
    return null;
  }

  return <Navbar />;
}

function App() {
  return (
    <BrowserRouter>
      <NavbarWrapper />
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/homepage" element={<Home />} />
        <Route path="/blogPosts/:id" element={<PostDetail />} />
        <Route path="/create" element={<CreatePost />} />
        <Route path="/edit/:id" element={<EditPost />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
