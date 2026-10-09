import { Link } from "react-router-dom";

function Home() {
  return (
    <main>
      <section className="hero">
        <div className="hero-overlay">
          <div className="hero-content">

            <p className="eyebrow">
              Fine Dining • Washington, DC
            </p>

            <h1>Café Fausse</h1>

            <p className="hero-description">
              Traditional Italian flavors meet modern culinary innovation.
            </p>

            <Link to="/reservations" className="button">
              Reserve a Table
            </Link>

          </div>
        </div>
      </section>

      <section className="restaurant-info">

        <div>
          <h2>Visit Us</h2>

          <p>1234 Culinary Ave, Suite 100</p>
          <p>Washington, DC 20002</p>
          <p>(202) 555-4567</p>
        </div>

        <div>
          <h2>Opening Hours</h2>

          <p>Monday – Saturday</p>
          <p>5:00 PM – 11:00 PM</p>

          <br />

          <p>Sunday</p>
          <p>5:00 PM – 9:00 PM</p>
        </div>

      </section>
    </main>
  );
}

export default Home;