# Café Fausse — Full-Stack Restaurant Website

## Project Overview

Café Fausse is a full-stack restaurant web application developed using React, Python Flask, and PostgreSQL.

The application provides customers with information about the restaurant, an interactive gallery, online table reservations, and newsletter subscriptions.

The project demonstrates frontend development, backend API design, database integration, form validation, and responsive web design.

## Technologies Used

| Component | Technology |
|---|---|
| Frontend | React, JavaScript, JSX, CSS |
| Backend | Python, Flask |
| Database | PostgreSQL |
| API Communication | HTTP, JSON |
| Development Tools | Visual Studio Code, Git, GitHub, pgAdmin |

## Features

- Responsive restaurant website
- Home, Menu, Reservations, About Us, and Gallery pages
- Online reservation form
- Automatic table assignment
- Reservation input validation
- Prevention of duplicate table bookings for the same time slot
- Newsletter subscription functionality
- PostgreSQL database integration
- Interactive image gallery

## Application Architecture

The application follows a three-tier architecture:

**React Frontend → Flask REST API → PostgreSQL Database**

The React frontend sends HTTP requests to the Flask backend. Flask validates the submitted information, processes reservation and newsletter requests, and communicates with PostgreSQL.

The backend returns JSON responses that are displayed in the user interface.

## Database Structure

The database contains two main tables.

### Customers

Stores customer information:

- `customer_id` — Primary key
- `name` — Customer name
- `email` — Email address
- `phone` — Optional phone number
- `newsletter_signup` — Newsletter subscription status

### Reservations

Stores reservation information:

- `reservation_id` — Primary key
- `customer_id` — Foreign key referencing customers
- `time_slot` — Reservation date and time
- `table_number` — Assigned table (1–30)
- `guest_count` — Number of guests (1–20)

The relationship between customers and reservations is one-to-many.

A unique constraint on `(time_slot, table_number)` prevents the same table from being booked twice for the same time slot.

## Installation

### Prerequisites

- Node.js and npm
- Python 3
- PostgreSQL
- Git

### 1. Clone the repository

```bash
git clone https://github.com/mahmoud1348/CafeFausse.git
cd CafeFausse
```

### 2. Configure PostgreSQL

Create a PostgreSQL database named `cafe_fausse`.

Run the SQL statements in `database/schema.sql` to create the required tables.

### 3. Configure the backend

Open the backend folder:

```bash
cd backend
```

Create and activate a Python virtual environment.

Windows:

```powershell
python -m venv venv
.\venv\Scripts\Activate.ps1
```

Install dependencies:

```bash
pip install -r requirements.txt
```

Create a `.env` file containing your local database configuration:

```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=cafe_fausse
DB_USER=postgres
DB_PASSWORD=YOUR_LOCAL_PASSWORD
```

Start the Flask application:

```bash
python app.py
```

The backend should be available at:

`http://127.0.0.1:5000`

### 4. Configure the frontend

Open a second terminal and navigate to the frontend directory:

```bash
cd frontend
npm install
npm run dev
```

Open the local URL displayed by Vite, typically:

`http://localhost:5173`

## API Endpoints

| Endpoint | Method | Description |
|---|---|---|
| `/api/test` | GET | Test backend availability |
| `/api/db-test` | GET | Test database connection |
| `/api/reservations` | POST | Create a reservation |
| `/api/newsletter` | POST | Subscribe to the newsletter |

## Validation and Data Integrity

The application validates required fields, email format, reservation date and time, guest count, and restaurant opening hours.

PostgreSQL constraints protect data consistency, including foreign keys, valid table numbers, valid guest counts, and unique table/time combinations.

## Testing

The application has been tested for:

- Frontend and backend communication
- PostgreSQL connectivity
- Reservation creation
- Automatic table assignment
- Duplicate table-booking prevention
- Invalid reservation inputs
- Newsletter subscriptions
- Responsive layouts

## Security

Database credentials are stored in a local `.env` file and excluded from version control.

## Project Purpose

This application was developed as an educational full-stack web development project, demonstrating the integration of a modern JavaScript frontend, Python backend, and relational database.