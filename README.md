# Airport Travel Advisor

## Project Description

The project presents a travel advisory system for airports. When a traveler wants to book a flight from one location to another, the system provides information on available routes, flight times, layovers, and costs, even when there are no direct flights. It also suggests alternative routes.

## Table of contents

- [🚀 Install and run](https://github.com/amerkul/node-airport/edit/main/README.md#install-and-run)
- [🌐 REST API](https://github.com/amerkul/node-airport/edit/main/README.md#rest-api)
     - [🏠 Airport info service](https://github.com/amerkul/node-airport/edit/main/README.md#airport-info-service)
     - [✈️ Airplane service](https://github.com/amerkul/node-airport/edit/main/README.md#airplane-service)
     - [💃 Passenger service](https://github.com/amerkul/node-airport/edit/main/README.md#passenger-service)
     - [📆 Flight service](https://github.com/amerkul/node-airport/edit/main/README.md#flight-service)
     - [✅ Booking service](https://github.com/amerkul/node-airport/edit/main/README.md#booking-service)

## Install and run

Later

## REST API

### Airport info service

1. List all airports 💚 (GET)
> `http://localhost:3000/api/v1/airports`

Returns a list of airports.

Query params
| Param | description|
|-------|------------|
| ids[] | Fitler airports by IDs. Multiple IDs can be provided using an ampersand separated list. For example, ids[]=1&ids[]=2| 
| names[] | Fitler airporsts by names. Multiple names can be provided using an ampersand separated list. For example, names[]=name_1&names[]=name_2|

3. Get airport info 💚 (GET)
4. Add the airport data 💛 (POST)
5. Archive an airport 💜 (PATCH)
6. Update airport info 💙 (PUT)
7. Delete an airport ❤️ (DELETE)

### Airplane service

1. List all airplanes 💚 (GET)
2. Get an airplane 💚 (GET)
3. Create an airplane 💛 (POST)
4. Archive an airplane 💜 (PATCH)
5. Update airplane info 💙 (PUT)
6. Delete an airplane ❤️ (DELETE) 

### Passenger service

1. List all passengers 💚 (GET)
2. Get a passenger's profile 💚 (GET)
3. Create a new passenger 💛 (POST)
4. Update passenger info 💙 (PUT)
5. Archive a passenger 💜 (PATCH)
6. Delete a passenger ❤️ (DELETE)

### Flight service

1. List all flights 💚 (GET)
2. Get flight info 💚 (GET)
3. Create a flight 💛 (POST)
4. Delete a flight ❤️ (DELETE)
5. Update a flight info 💙 (PUT)

### Booking service

1. Book a flight 💛 (POST)
2. List all booked flights 💚 (GET)
3. Get booking info 💚 (GET)
4. Update booking 💙 (PUT)
5. Change booking status 💜 (PATCH)
6. Delete booking ❤️ (DELETE)
   

