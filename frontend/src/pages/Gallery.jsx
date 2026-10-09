import { useState } from "react";

const galleryImages = [
  {
    src: "/images/gallery-cafe-interior.webp",
    alt: "Café Fausse restaurant interior",
    title: "The Café Fausse Experience",
    category: "Interior",
  },
  {
    src: "/images/gallery-ribeye-steak.webp",
    alt: "Ribeye steak served at Café Fausse",
    title: "Ribeye Steak",
    category: "Cuisine",
  },
  {
    src: "/images/gallery-special-event.webp",
    alt: "Special event at Café Fausse",
    title: "An Evening at Café Fausse",
    category: "Special Events",
  },
];

const awards = [
  {
    year: "2022",
    title: "Culinary Excellence Award",
  },
  {
    year: "2023",
    title: "Restaurant of the Year",
  },
  {
    year: "2023",
    title: "Best Fine Dining Experience",
    source: "Foodie Magazine",
  },
];

function Gallery() {
  const [selectedImage, setSelectedImage] = useState(null);

  function openLightbox(image) {
    setSelectedImage(image);
  }

  function closeLightbox() {
    setSelectedImage(null);
  }

  return (
    <main className="gallery-page">

      {/* Header */}

      <section className="page-header">
        <p className="eyebrow dark-eyebrow">Café Fausse</p>

        <h1>Gallery</h1>

        <p>
          A glimpse into the food, atmosphere, and experiences that define
          Café Fausse.
        </p>
      </section>


      {/* Gallery */}

      <section className="gallery-section">

        <div className="gallery-intro">
          <p className="eyebrow dark-eyebrow">Discover Café Fausse</p>

          <h2>A Taste of the Experience</h2>

          <p>
            Explore our dining room, signature dishes, and memorable evenings
            shared with our guests.
          </p>
        </div>


        <div className="gallery-grid">

          {galleryImages.map((image) => (
            <button
              type="button"
              className="gallery-item"
              key={image.src}
              onClick={() => openLightbox(image)}
            >
              <img
                src={image.src}
                alt={image.alt}
              />

              <div className="gallery-item-overlay">
                <p>{image.category}</p>
                <h3>{image.title}</h3>
                <span>View Image</span>
              </div>
            </button>
          ))}

        </div>

      </section>


      {/* Awards */}

      <section className="awards-section">

        <div className="section-title awards-title">
          <p className="eyebrow dark-eyebrow">
            Recognition
          </p>

          <h2>Awards & Honors</h2>
        </div>


        <div className="awards-grid">

          {awards.map((award) => (
            <article
              className="award-card"
              key={`${award.title}-${award.year}`}
            >

              <span className="award-year">
                {award.year}
              </span>

              <h3>
                {award.title}
              </h3>

              {award.source && (
                <p>{award.source}</p>
              )}

            </article>
          ))}

        </div>

      </section>


      {/* Reviews */}

      <section className="reviews-section">

        <div className="section-title">
          <p className="eyebrow dark-eyebrow">
            Guest Experiences
          </p>

          <h2>What Our Guests Say</h2>
        </div>


        <div className="reviews-grid">

          <article className="review-card">
            <div className="review-stars">
              ★★★★★
            </div>

            <blockquote>
              “A wonderful dining experience with exceptional food,
              atmosphere, and service.”
            </blockquote>
          </article>


          <article className="review-card">
            <div className="review-stars">
              ★★★★★
            </div>

            <blockquote>
              “Beautifully prepared dishes and a welcoming atmosphere.
              Café Fausse is always a memorable experience.”
            </blockquote>
          </article>

        </div>

      </section>


      {/* Lightbox */}

      {selectedImage && (
        <div
          className="lightbox"
          onClick={closeLightbox}
        >

          <button
            type="button"
            className="lightbox-close"
            onClick={closeLightbox}
            aria-label="Close image"
          >
            ×
          </button>


          <div
            className="lightbox-content"
            onClick={(event) => event.stopPropagation()}
          >

            <img
              src={selectedImage.src}
              alt={selectedImage.alt}
            />

            <div className="lightbox-caption">

              <p>
                {selectedImage.category}
              </p>

              <h3>
                {selectedImage.title}
              </h3>

            </div>

          </div>

        </div>
      )}

    </main>
  );
}

export default Gallery;
