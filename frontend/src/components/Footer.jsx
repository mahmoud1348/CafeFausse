import { useState } from "react";
import { Link } from "react-router-dom";

function Footer() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

async function handleNewsletterSubmit(event) {
  event.preventDefault();
  if (!email.trim()) {
    setMessage("Please enter your email address.");
    return;
  }
  setMessage("Joining newsletter...");
  try {
    const response = await fetch(
      "http://127.0.0.1:5000/api/newsletter",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
        }),
      }
    );

    const data = await response.json();
    if (!response.ok) {
      setMessage(data.message || "Newsletter signup failed.");
      return;
    }

    setMessage(data.message);
    setEmail("");
  } catch (error) {
    console.error(error);
    setMessage("Could not connect to the newsletter server.");
  }
}

  return (
    <footer className="footer">
      <div className="footer-main">
        {/* Restaurant */}
        <div className="footer-brand">
          <h2>Café Fausse</h2>
          <p>Traditional Italian flavors meet modern culinary innovation in the heart of Washington, DC. </p>
          <div className="footer-contact">
            <p>1234 Culinary Ave, Suite 100</p>
            <p>Washington, DC 20002</p>
            <p>(202) 555-4567</p>
          </div>
        </div>

        {/* Navigation */}

        <div className="footer-column">
          <h3>Explore</h3>
          <nav className="footer-links">
            <Link to="/">Home</Link>
            <Link to="/menu">Menu</Link>
            <Link to="/reservations">Reservations</Link>
            <Link to="/about">About Us</Link>
            <Link to="/gallery">Gallery</Link>
          </nav>
        </div>

        {/* Opening Hours */}

        <div className="footer-column">
          <h3>Opening Hours</h3>
          <div className="footer-hours">
            <p>Monday – Saturday</p>
            <span>5:00 PM – 11:00 PM</span>
            <p className="footer-sunday">Sunday</p>
            <span>5:00 PM – 9:00 PM</span>
          </div>
        </div>

        {/* Newsletter */}

        <div className="footer-newsletter">
          <h3>Newsletter</h3>
          <p>Join our mailing list for restaurant news, events, and special announcements.</p>
          <form
            className="newsletter-form"
            onSubmit={handleNewsletterSubmit}
          >
            <label htmlFor="newsletter-email">Email Address</label>
            <div className="newsletter-input-group">
              <input
                type="email"
                id="newsletter-email"
                placeholder="you@example.com"
                value={email}
                onChange={(event) => {
                  setEmail(event.target.value);
                  setMessage("");
                }}
                required
              />
              <button type="submit">Join</button>
            </div>
            {message && (
              <p className="newsletter-message"> {message}</p>
            )}
          </form>
        </div>
      </div>

      {/* Bottom */}

      <div className="footer-bottom">
        <p>© 2026 Café Fausse. All rights reserved.</p>
        <p>Washington, DC</p>
      </div>
    </footer>
  );
}

export default Footer;
