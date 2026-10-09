import { useState } from "react";

const today = new Date().toISOString().split("T")[0];

function Reservations() {
  const [formData, setFormData] = useState({
    date: "",
    time: "",
    guests: "2",
    name: "",
    email: "",
    phone: "",
  });

  const [message, setMessage] = useState("");

  function handleChange(event) {
    const { name, value } = event.target;

    setFormData((previousData) => ({
      ...previousData,
      [name]: value,
    }));
  }

async function handleSubmit(event) {
  event.preventDefault();
  setMessage("Checking availability...");
  try {
    const response = await fetch(
      "http://127.0.0.1:5000/api/reservations",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      }
    );

    const data = await response.json();
    if (!response.ok) {
      setMessage(data.message || "Unable to create reservation.");
      return;
    }
    setMessage(`Reservation confirmed! Your table number is ${data.table_number}.`);
    setFormData({
      date: "",
      time: "",
      guests: "2",
      name: "",
      email: "",
      phone: "",
    });

  } catch (error) {
    console.error(error);
    setMessage("Could not connect to the reservation server.");
  }
}

  return (
    <main className="reservation-page">
      <section className="reservation-header">
        <p className="eyebrow dark-eyebrow">Café Fausse</p>

        <h1>Reservations</h1>

        <p>
          Join us for an unforgettable dining experience in Washington, DC.
        </p>
      </section>

      <section className="reservation-container">
        <div className="reservation-info">
          <p className="eyebrow dark-eyebrow">Reserve Your Table</p>

          <h2>Plan Your Evening</h2>

          <p>
            Select your preferred date and time, tell us how many guests will
            be joining you, and enter your contact information.
          </p>

          <div className="reservation-details">
            <div>
              <h3>Opening Hours</h3>
              <p>Monday – Saturday</p>
              <p>5:00 PM – 11:00 PM</p>

              <p className="reservation-sunday">Sunday</p>
              <p>5:00 PM – 9:00 PM</p>
            </div>

            <div>
              <h3>Contact</h3>
              <p>(202) 555-4567</p>
              <p>1234 Culinary Ave, Suite 100</p>
              <p>Washington, DC 20002</p>
            </div>
          </div>
        </div>

        <div className="reservation-form-wrapper">
          <form className="reservation-form" onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="date">Date</label>

                <input
                  type="date"
                  id="date"
                  name="date"
                  min={today}
                  value={formData.date}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="time">Time</label>

                <select
                  id="time"
                  name="time"
                  value={formData.time}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select a time</option>
                  <option value="17:00">5:00 PM</option>
                  <option value="17:30">5:30 PM</option>
                  <option value="18:00">6:00 PM</option>
                  <option value="18:30">6:30 PM</option>
                  <option value="19:00">7:00 PM</option>
                  <option value="19:30">7:30 PM</option>
                  <option value="20:00">8:00 PM</option>
                  <option value="20:30">8:30 PM</option>
                  <option value="21:00">9:00 PM</option>
                  <option value="21:30">9:30 PM</option>
                  <option value="22:00">10:00 PM</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="guests">Number of Guests</label>

              <select
                id="guests"
                name="guests"
                value={formData.guests}
                onChange={handleChange}
                required
              >
                <option value="1">1 Guest</option>
                <option value="2">2 Guests</option>
                <option value="3">3 Guests</option>
                <option value="4">4 Guests</option>
                <option value="5">5 Guests</option>
                <option value="6">6 Guests</option>
                <option value="7">7 Guests</option>
                <option value="8">8 Guests</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="name">Full Name</label>

              <input
                type="text"
                id="name"
                name="name"
                placeholder="Your full name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Email Address</label>

              <input
                type="email"
                id="email"
                name="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="phone">
                Phone Number <span>(optional)</span>
              </label>

              <input
                type="tel"
                id="phone"
                name="phone"
                placeholder="Your phone number"
                value={formData.phone}
                onChange={handleChange}
              />
            </div>

            <button type="submit" className="reservation-button">
              Check Availability
            </button>

            {message && (
              <p className="reservation-message">
                {message}
              </p>
            )}
          </form>
        </div>
      </section>
    </main>
  );
}

export default Reservations;
