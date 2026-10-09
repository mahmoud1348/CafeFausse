
-- Cafe Fausse PostgreSQL Database Schema
-- Run inside the cafe_fausse database.

-- Table: public.customers
-- DROP TABLE IF EXISTS public.customers;

CREATE TABLE IF NOT EXISTS public.customers
(
    customer_id serial NOT NULL,
    name character varying(100) COLLATE pg_catalog."default" NOT NULL,
    email character varying(255) COLLATE pg_catalog."default" NOT NULL,
    phone character varying(30) COLLATE pg_catalog."default",
    newsletter_signup boolean NOT NULL DEFAULT false,
    CONSTRAINT customers_pkey PRIMARY KEY (customer_id)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.customers
    OWNER to postgres;

-- Table: public.reservations
-- DROP TABLE IF EXISTS public.reservations;

CREATE TABLE IF NOT EXISTS public.reservations
(
    reservation_id serial NOT NULL,
    customer_id integer NOT NULL,
    time_slot timestamp without time zone NOT NULL,
    table_number integer NOT NULL,
    guest_count integer NOT NULL DEFAULT 1,
    CONSTRAINT reservations_pkey PRIMARY KEY (reservation_id),
    CONSTRAINT unique_table_time UNIQUE (time_slot, table_number),
    CONSTRAINT fk_customer FOREIGN KEY (customer_id)
        REFERENCES public.customers (customer_id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE CASCADE,
    CONSTRAINT reservations_table_number_check CHECK (table_number >= 1 AND table_number <= 30),
    CONSTRAINT reservations_guest_count_check CHECK (guest_count >= 1 AND guest_count <= 20)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.reservations
    OWNER to postgres;