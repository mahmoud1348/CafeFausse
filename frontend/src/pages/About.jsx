function About() {
  return (
    <main className="about-page">
      <section className="page-header">
        <p className="eyebrow dark-eyebrow">Our Story</p>
        <h1>About Café Fausse</h1>
        <p>
          Tradition, creativity, and a passion for unforgettable dining.
        </p>
      </section>

      <section className="about-story">
        <div className="about-story-content">
          <p className="eyebrow dark-eyebrow">Since 2010</p>

          <h2>A Passion for Italian Cuisine</h2>

          <p>
            Café Fausse was founded in 2010 by Chef Antonio Rossi and
            restaurateur Maria Lopez with a shared vision: to combine
            traditional Italian cuisine with modern culinary innovation.
          </p>

          <p>
            From carefully selected ingredients to thoughtfully prepared
            dishes, every detail reflects our commitment to creating an
            unforgettable dining experience for our guests.
          </p>

          <p>
            We are proud to use locally sourced ingredients whenever possible,
            bringing freshness, quality, and seasonal character to our menu.
          </p>
        </div>

        <div className="about-quote">
          <span>“</span>
          <blockquote>
            Our mission is to create an unforgettable dining experience where
            tradition and innovation come together.
          </blockquote>
        </div>
      </section>

      <section className="founders-section">
        <div className="section-title">
          <p className="eyebrow dark-eyebrow">The People Behind Café Fausse</p>
          <h2>Meet Our Founders</h2>
        </div>

        <div className="founders-grid">
          <article className="founder-card">
            <div className="founder-number">01</div>

            <h3>Chef Antonio Rossi</h3>

            <p className="founder-role">Chef & Co-Founder</p>

            <p>
              Chef Antonio Rossi brings a passion for traditional Italian
              flavors and combines them with contemporary culinary techniques.
              His approach forms the heart of Café Fausse's kitchen.
            </p>
          </article>

          <article className="founder-card">
            <div className="founder-number">02</div>

            <h3>Maria Lopez</h3>

            <p className="founder-role">Restaurateur & Co-Founder</p>

            <p>
              Maria Lopez brings her experience in hospitality and restaurant
              management to Café Fausse, creating a warm and welcoming
              atmosphere centered around exceptional guest experiences.
            </p>
          </article>
        </div>
      </section>

      <section className="about-values">
        <div>
          <span>01</span>
          <h3>Tradition</h3>
          <p>
            Celebrating the flavors and foundations of Italian cuisine.
          </p>
        </div>

        <div>
          <span>02</span>
          <h3>Innovation</h3>
          <p>
            Bringing a modern perspective to classic culinary ideas.
          </p>
        </div>

        <div>
          <span>03</span>
          <h3>Quality</h3>
          <p>
            Choosing fresh, locally sourced ingredients whenever possible.
          </p>
        </div>
      </section>
    </main>
  );
}

export default About;
