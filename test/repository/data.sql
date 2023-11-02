INSERT INTO airports(name, iata, icao, country, city, latitude, longitude, archive)
VALUES ('National Airport Minsk', 'MSQ', 'UMMS', 'Belarus', 'Minsk', 53.882222, 28.030556, false),
       ('Brussels International Airport', 'BRU', 'EBBR', 'Belgium', 'Brussels', 50.846667, 4.3525, false);

INSERT INTO airlines(name, iata, archive, base_airport_id)
VALUES ('Belavia', 'B2' , false, 1),
       ('Brussels Airlines', 'SN', false, 2),
       ('TUI fly Belgium', 'TB', false, 2);

INSERT INTO airplanes(name, capacity, airline_id)
VALUES ('Boeing 737-500', 125, 1),
       ('Boeing 737-800', 222, 1),
       ('Airbus A330-300', 215, 2),
       ('Airbus A320-200', 156, 3);

INSERT INTO passengers(full_name, email, birthday, passport, user_id)
VALUES ('Anna Merkul', 'amerkul@gmail.com', '2002-08-16', 'MP7777777', null);

INSERT INTO flights(depature, arrival, price, status, from_id, to_id, airplane_id, airline_id)
VALUES ('2023-10-31', '2023-11-01', 400, 'Scheduled', 1, 2, 1, 1),
	   ('2023-11-01', '2023-11-02', 500, 'Scheduled', 2, 1, 2, 2);

INSERT INTO users(role, username, password, first_name, last_name, passport, email, birthday, 
				 full_name, phone, sex, active)
VALUES ('Passenger', 'cat', '$2y$10$g5NuZ2nAWAsQOij1e9VRy.2oZKGhC2XH4G66RllU41u52Zr108yCO', 
	   'Cat', 'Black', 'MP5656565', 'cat@mail.ru', '2005-03-03', 'Cat Black', '+375291111111',
	   'Female', true);

INSERT INTO users(role, username, password, first_name, last_name, passport, email, birthday, 
				 full_name, phone, sex, active)
VALUES ('Manager', 'dog', '$2y$10$5VZOdoki./.sSIOOwGsILeurCV97EZnKheOugFJaTqocjxzueZx7a', 
	   'Dog', 'White', 'MP3433434', 'dog@mail.ru', '2004-03-03', 'Dog White', '+375292222222',
	   'Male', true),
	   ('Admin', 'amerkul', '$2y$10$Zfi5kbTrmZqlqOp1itJrM.8iJPLNGSd3Az0WURXXR6BIREDeQU/q2', 
	   'Anna', 'Merkul', 'MP7777777', 'amerkul@mail.ru', '2002-08-16', 'Anna Merkul', '+375293376183',
	   'Female', true);
	   
INSERT INTO employees(department, salary, user_id)
VALUES ('CEO', 1000, 3),
	   ('Test automation', 700, 2);

INSERT INTO bookings(seat, status, passenger_id, flight_id)
VALUES (10, 'Reserved', 1, 1);