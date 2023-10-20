CREATE TABLE airports (
	airport_id serial PRIMARY KEY,
	iata VARCHAR ( 50 ) UNIQUE NOT NULL,
	icao VARCHAR ( 50 ) NOT NULL,
	name VARCHAR ( 255 ) UNIQUE NOT NULL,
	created_on TIMESTAMP NOT NULL,
        last_login TIMESTAMP 
);