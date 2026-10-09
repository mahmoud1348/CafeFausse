import os
import re
import random
import psycopg2

from datetime import datetime
from dotenv import load_dotenv
from flask import Flask, jsonify, request
from flask_cors import CORS

load_dotenv()

app = Flask(__name__)
CORS(app)

def get_db_connection():
    connection   = psycopg2.connect(
        host     = os.getenv("DB_HOST"),
        port     = os.getenv("DB_PORT"),
        database = os.getenv("DB_NAME"),
        user     = os.getenv("DB_USER"),
        password = os.getenv("DB_PASSWORD"),
    )
    return connection

# ========================================
# VALIDATION HELPERS
# ========================================

def is_valid_email(email):
    email_pattern = r"^[^@\s]+@[^@\s]+\.[^@\s]+$"
    return re.match(email_pattern, email) is not None

def is_valid_opening_time(reservation_time):
    weekday = reservation_time.weekday()
    # Monday = 0
    # Sunday = 6
    opening_time = reservation_time.replace(
        hour=17,
        minute=0,
        second=0,
        microsecond=0
    )
    if weekday == 6:
        closing_time = reservation_time.replace(
            hour=21,
            minute=0,
            second=0,
            microsecond=0
        )
    else:
        closing_time = reservation_time.replace(
            hour=23,
            minute=0,
            second=0,
            microsecond=0
        )
    return opening_time <= reservation_time < closing_time

# ========================================
# TEST FLASK
# ========================================

@app.route("/api/test", methods=["GET"])
def test_api():
    return jsonify({
        "success": True,
        "message": "Café Fausse backend is working!"
    })

# ========================================
# TEST DATABASE
# ========================================

@app.route("/api/db-test", methods=["GET"])
def test_database():
    connection = None
    try:
        connection = get_db_connection()
        cursor = connection.cursor()
        cursor.execute("SELECT current_database();")
        database_name = cursor.fetchone()[0]
        cursor.close()
        return jsonify({
            "success": True,
            "message": "PostgreSQL connection successful!",
            "database": database_name
        })
    except Exception as error:
        return jsonify({
            "success": False,
            "message": "Could not connect to PostgreSQL.",
            "error": str(error)
        }), 500
    finally:
        if connection:
            connection.close()

# ========================================
# CREATE RESERVATION
# ========================================
@app.route("/api/reservations", methods=["POST"])
def create_reservation():
    connection = None
    cursor = None
    try:
        data = request.get_json()

        if not data:
            return jsonify({
                "success": False,
                "message": "No reservation data received."
            }), 400

        date  = str(data.get("date", "")).strip()
        time  = str(data.get("time", "")).strip()
        name  = str(data.get("name", "")).strip()
        email = str(data.get("email", "")).strip().lower()
        phone = str(data.get("phone", "")).strip()

        try:
            guests = int(data.get("guests", 0))
        except (TypeError, ValueError):
            guests = 0

        # --------------------------------
        # Required fields
        # --------------------------------

        if not date or not time or not name or not email:
            return jsonify({
                "success": False,
                "message": "Please complete all required fields."
            }), 400

        # --------------------------------
        # Email validation
        # --------------------------------

        if not is_valid_email(email):
            return jsonify({
                "success": False,
                "message": "Please enter a valid email address."
            }), 400

        # --------------------------------
        # Guest validation
        # --------------------------------

        if guests < 1 or guests > 20:
            return jsonify({
                "success": False,
                "message": "Guest count must be between 1 and 20."
            }), 400

        # --------------------------------
        # Convert date + time
        # --------------------------------

        try:
            reservation_time = datetime.strptime(
                f"{date} {time}",
                "%Y-%m-%d %H:%M"
            )
        except ValueError:
            return jsonify({
                "success": False,
                "message": "Invalid reservation date or time."
            }), 400

        # --------------------------------
        # Past reservation validation
        # --------------------------------

        if reservation_time <= datetime.now():
            return jsonify({
                "success": False,
                "message": "Reservations must be made for a future date and time."
            }), 400

        # --------------------------------
        # Opening hours validation
        # --------------------------------

        if not is_valid_opening_time(reservation_time):
            if reservation_time.weekday() == 6:
                hours_message = "Sunday reservations are available from 5:00 PM to 9:00 PM."
            else:
                hours_message = "Monday through Saturday reservations are available from 5:00 PM to 11:00 PM."
            return jsonify({
                "success": False,
                "message": hours_message
            }), 400

        # --------------------------------
        # Database connection
        # --------------------------------

        connection = get_db_connection()
        cursor = connection.cursor()

        # --------------------------------
        # Find occupied tables
        # --------------------------------

        cursor.execute(
            """
            SELECT table_number
            FROM reservations
            WHERE time_slot = %s;
            """,
            (reservation_time,)
        )

        occupied_tables = { row[0] for row in cursor.fetchall() }

        # --------------------------------
        # Find free tables
        # --------------------------------

        all_tables = set(range(1, 31))
        available_tables = list( all_tables - occupied_tables )

        # --------------------------------
        # Fully booked
        # --------------------------------

        if not available_tables:
            return jsonify({
                "success": False,
                "message": ("Sorry, Café Fausse is fully booked for this time slot.")
            }), 409

        # --------------------------------
        # Random table
        # --------------------------------

        table_number = random.choice(available_tables)

        # --------------------------------
        # Create customer
        # --------------------------------

        cursor.execute(
            """
            INSERT INTO customers
                (name, email, phone, newsletter_signup)
            VALUES
                (%s, %s, %s, FALSE)
            RETURNING customer_id;
            """,
            (
                name,
                email,
                phone if phone else None
            )
        )
        customer_id = cursor.fetchone()[0]

        # --------------------------------
        # Create reservation
        # --------------------------------

        cursor.execute(
            """
            INSERT INTO reservations
                (
                    customer_id,
                    time_slot,
                    table_number,
                    guest_count
                )
            VALUES
                (%s, %s, %s, %s)
            RETURNING reservation_id;
            """,
            (
                customer_id,
                reservation_time,
                table_number,
                guests
            )
        )
        reservation_id = cursor.fetchone()[0]
        connection.commit()

        # --------------------------------
        # Success
        # --------------------------------

        return jsonify({
            "success": True,
            "message": "Reservation confirmed!",
            "reservation_id": reservation_id,
            "table_number": table_number,
            "time_slot": reservation_time.isoformat(),
            "guest_count": guests
        }), 201

    except psycopg2.IntegrityError:
        if connection:
            connection.rollback()
        return jsonify({
            "success": False,
            "message": ("That table was just reserved by another guest. Please try again.")
        }), 409
    except Exception as error:
        if connection:
            connection.rollback()
        return jsonify({
            "success": False,
            "message": "An error occurred while creating the reservation.",
            "error": str(error)
        }), 500
    finally:
        if cursor:
            cursor.close()
        if connection:
            connection.close()

# ========================================
# NEWSLETTER SIGNUP
# ========================================

@app.route("/api/newsletter", methods=["POST"])
def newsletter_signup():
    connection = None
    cursor = None
    try:
        data = request.get_json()
        if not data:
            return jsonify({
                "success": False,
                "message": "No newsletter data received."
            }), 400
        email = str(data.get("email", "")).strip().lower()
        if not email:
            return jsonify({
                "success": False,
                "message": "Please enter your email address."
            }), 400
        if not is_valid_email(email):
            return jsonify({
                "success": False,
                "message": "Please enter a valid email address."
            }), 400
        connection = get_db_connection()
        cursor = connection.cursor()
        # Check whether this email already belongs to a customer.
        cursor.execute(
            """
            SELECT customer_id, newsletter_signup
            FROM customers
            WHERE LOWER(email) = %s
            ORDER BY customer_id
            LIMIT 1;
            """,
            (email,)
        )
        existing_customer = cursor.fetchone()
        if existing_customer:
            customer_id = existing_customer[0]
            already_subscribed = existing_customer[1]
            if already_subscribed:
                return jsonify({
                    "success": True,
                    "message": "This email is already subscribed to our newsletter."
                }), 200
            cursor.execute(
                """
                UPDATE customers
                SET newsletter_signup = TRUE
                WHERE customer_id = %s;
                """,
                (customer_id,)
            )
        else:
            cursor.execute(
                """
                INSERT INTO customers
                    (name, email, phone, newsletter_signup)
                VALUES
                    (%s, %s, %s, TRUE);
                """,
                (
                    "Newsletter Subscriber",
                    email,
                    None
                )
            )
        connection.commit()
        return jsonify({
            "success": True,
            "message": "Thank you for joining our newsletter!"
        }), 201

    except Exception as error:
        if connection:
            connection.rollback()
        return jsonify({
            "success": False,
            "message": "Could not complete newsletter signup.",
            "error": str(error)
        }), 500
    finally:
        if cursor:
            cursor.close()
        if connection:
            connection.close()

if __name__ == "__main__":
    app.run(debug=True)
