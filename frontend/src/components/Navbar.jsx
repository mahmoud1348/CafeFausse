import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="navbar">
      <Link to="/" className="logo">
        Café Fausse
      </Link>

      <div className="nav-links">
        <Link to="/">Home</Link>
        <Link to="/menu">Menu</Link>
        <Link to="/reservations">Reservations</Link>
        <Link to="/about">About Us</Link>
        <Link to="/gallery">Gallery</Link>
      </div>
    </nav>
  );
}

export default Navbar;