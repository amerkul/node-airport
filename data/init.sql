CREATE TYPE FLIGHT_STATUSES AS ENUM ('Scheduled', 'Delayed', 'Departed', 'In Air', 'Arrived', 'Cancelled');

CREATE TYPE BOOKING_STATUSES AS ENUM ('Reserved', 'Cancelled', 'Paid');

CREATE TYPE USER_ROLE AS ENUM ('Admin', 'Manager', 'Passenger');

CREATE TYPE SEX AS ENUM ('Male', 'Female');

CREATE TABLE airports (
	airport_id serial PRIMARY KEY,
	name VARCHAR ( 255 ) UNIQUE NOT NULL,
	iata VARCHAR ( 3 ) UNIQUE NOT NULL,
	icao VARCHAR ( 4 ) UNIQUE NOT NULL,
	country VARCHAR ( 50 ) NOT NULL,
	city VARCHAR ( 50 ) NOT NULL,
	latitude NUMERIC( 9,6 ),
    longitude NUMERIC( 9,6 ),
	archive BOOLEAN NOT NULL DEFAULT false
);

CREATE TABLE airlines (
	airline_id serial PRIMARY KEY,
	name VARCHAR ( 255 ) UNIQUE NOT NULL,
	iata VARCHAR ( 3 ) UNIQUE NOT NULL,
	archive BOOLEAN NOT NULL DEFAULT false,
	base_airport_id INTEGER NOT NULL 
);

ALTER TABLE airlines 
ADD CONSTRAINT airlines_airports_fk
FOREIGN KEY ( base_airport_id ) REFERENCES airports( airport_id )
ON DELETE CASCADE;

CREATE TABLE airplanes (
	airplane_id serial PRIMARY KEY,
	name VARCHAR ( 255 ) UNIQUE NOT NULL,
	capacity INTEGER NOT NULL,
	archive BOOLEAN NOT NULL DEFAULT false,
	airline_id INTEGER NOT NULL 
);

ALTER TABLE airplanes
ADD CONSTRAINT airplanes_airlines_fk
FOREIGN KEY ( airline_id ) REFERENCES airlines( airline_id )
ON DELETE CASCADE;

CREATE TABLE users (
	user_id serial PRIMARY KEY,
	role USER_ROLE NOT NULL DEFAULT 'Passenger',
	username VARCHAR ( 255 ) UNIQUE NOT NULL,
	password VARCHAR ( 72 ) NOT NULL,
	first_name VARCHAR ( 255 ) NOT NULL,
	last_name VARCHAR ( 255 ) NOT NULL,
	passport VARCHAR ( 9 ) UNIQUE NOT NULL,
	email VARCHAR ( 255 ) UNIQUE NOT NULL,
	birthday DATE NOT NULL,
	full_name VARCHAR ( 255 ) NOT NULL,
	phone VARCHAR ( 255 ) UNIQUE,
	sex SEX,
	country VARCHAR ( 255 ),
	city VARCHAR ( 255 ),
	zip INTEGER,
	street VARCHAR ( 255 ),
	active BOOLEAN NOT NULL DEFAULT true
);

CREATE TABLE passengers (
	passenger_id serial PRIMARY KEY,
	full_name VARCHAR ( 255 ) NOT NULL,
	passport VARCHAR ( 9 ) NOT NULL,
	birthday DATE NOT NULL,
	email VARCHAR ( 255 ) NOT NULL,
	user_id INTEGER 
);

ALTER TABLE passengers
ADD CONSTRAINT passengers_users_fk
FOREIGN KEY ( user_id ) REFERENCES users( user_id )
ON DELETE CASCADE;


CREATE TABLE employees (
	department VARCHAR ( 255 ) NOT NULL,
	salary NUMERIC( 20, 2 ),
	user_id INTEGER NOT NULL UNIQUE 
);

ALTER TABLE employees
ADD CONSTRAINT employees_user_fk
FOREIGN KEY ( user_id ) REFERENCES users( user_id )
ON DELETE CASCADE;

CREATE TABLE flights (
	flight_id serial PRIMARY KEY,
	depature TIMESTAMP NOT NULL,
	arrival TIMESTAMP NOT NULL,
	price NUMERIC ( 20, 2 ) NOT NULL,
	status FLIGHT_STATUSES NOT NULL DEFAULT 'Scheduled',
	from_id INTEGER NOT NULL,
	to_id INTEGER NOT NULL,
	airplane_id INTEGER NOT NULL,
	airline_id INTEGER NOT NULL
);

ALTER TABLE flights
ADD CONSTRAINT unique_flight
UNIQUE (airplane_id, depature, arrival, from_id, to_id);

ALTER TABLE flights
ADD CONSTRAINT flights_from_fk
FOREIGN KEY ( from_id ) REFERENCES airports( airport_id )
ON DELETE CASCADE;

ALTER TABLE flights
ADD CONSTRAINT flights_to_fk
FOREIGN KEY ( to_id ) REFERENCES airports( airport_id )
ON DELETE CASCADE;

ALTER TABLE flights 
ADD CONSTRAINT flights_airplane_fk
FOREIGN KEY ( airplane_id ) REFERENCES airplanes( airplane_id )
ON DELETE CASCADE;

ALTER TABLE flights
ADD CONSTRAINT flights_airline_fk
FOREIGN KEY ( airline_id ) REFERENCES airlines( airline_id )
ON DELETE CASCADE;

CREATE TABLE bookings (
	booking_id serial PRIMARY KEY,
	seat INTEGER NOT NULL,
	status BOOKING_STATUSES NOT NULL DEFAULT 'Reserved', 
	passenger_id INTEGER NOT NULL, 
	flight_id INTEGER NOT NULL 
);

ALTER TABLE bookings
ADD CONSTRAINT bookings_passengers_fk
FOREIGN KEY ( passenger_id ) REFERENCES passengers( passenger_id )
ON DELETE CASCADE;

ALTER TABLE bookings
ADD CONSTRAINT bookings_flight_fk
FOREIGN KEY ( flight_id ) REFERENCES flights( flight_id )
ON DELETE CASCADE;
