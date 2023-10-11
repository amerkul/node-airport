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
   | Param | Type | description |
   |-------|------|------------|
   | ids[] | Integer | Fitler airports by IDs. Multiple IDs can be provided using an ampersand separated list. For example, ids[]=1&ids[]=2. |
   | name | String | Fitler airporsts by name. |
   | country | String | Fitler airporsts by country. |
   | city | String | Filter airports by city. |
   | page | Integer | Filter airports by page. |
   | per_page | Integer | Filter airports by this value. |

3. Get airport info 💚 (GET)
   > `http://localhost:3000/api/v1/airports/{airport_id}`

   Get an airport.
   
   
4. Add the airport data 💛 (POST)
   > `http://localhost:3000/api/v1/airports`

   Create an airport.
   
5. Archive an airport 💜 (PATCH)
   > `http://localhost:3000/api/v1/airports/{airport_id}`

   Change an airport status.
   
6. Update airport info 💙 (PUT)
   > `http://localhost:3000/api/v1/airports/{airport_id}`

   Update airport details
   
7. Delete an airport ❤️ (DELETE)
   > `http://localhost:3000/api/v1/airports/{airport_id}`

   Delete an airport.
   
8. List of airport airplanes 💚 (GET)
   > `http://localhost:3000/api/v1/airports/{airport_id}/airplanes`

   Returns a list of airport airplanes.

   Query params
   | Param | Type | description |
   |-------|------|------------|
   | ids[] | String | Fitler airplanes by IDs. Multiple IDs can be provided using an ampersand separated list. For example, ids[]=1&ids[]=2. |
   | page | Integer | Filter airplanes by page. |
   | per_page | Integer | Filter airplanes by this value. |

### Airplane service

1. List all airplanes 💚 (GET)
   > `http://localhost:3000/api/v1/airplanes`

   Returns a list of airplanes.

   Query params
   | Param | Type | description |
   |-------|------|------------|
   | ids[] | String | Fitler airplanes by IDs. Multiple IDs can be provided using an ampersand separated list. For example, ids[]=1&ids[]=2. |
   | page | Integer | Filter airplanes by page. |
   | per_page | Integer | Filter airplanes by this value. |
   
3. Get an airplane 💚 (GET)
   > `http://localhost:3000/api/v1/airplanes/{airplane_id}`

   Get airplane details.
   
4. Create an airplane 💛 (POST)
   > `http://localhost:3000/api/v1/airplanes`

   Create an airplane.
   
5. Archive an airplane 💜 (PATCH)
   > `http://localhost:3000/api/v1/airplanes/{airplane_id}`

   Change an airplane status.
   
6. Update airplane info 💙 (PUT)
   > `http://localhost:3000/api/v1/airplanes/{airplane_id}`

   Update airplane details.
   
7. Delete an airplane ❤️ (DELETE)
   > `http://localhost:3000/api/v1/airplanes/{airplane_id}`

   Delete an airplane.

8. List of airplane flights 💚 (GET)
   > `http://localhost:3000/api/v1/airplanes/{airplane_id}/flights`

   Returns a list of airplane flights.

   Query params
   | Param | Type | description |
   |-------|------|------------|
   | ids[] | Integer | Fitler flights by IDs. Multiple IDs can be provided using an ampersand separated list. For example, ids[]=1&ids[]=2. |
   | from  | Integer | Filter flights by place of departure. Provide an airport id. |
   | to    | Integer | Filter flights by place of arrival. Provide an airport id. |
   | departure | Date | Filter flights on this value. |
   | arrival | Date | Filter flights on this value. |
   | page | Integer | Filter flights by page. |
   | per_page | Integer | Filter flights by this value. |

### Passenger service

1. List all passengers 💚 (GET)
   > `http://localhost:3000/api/v1/passengers`

   Returns a list of passengers.

   Query params
   | Param | Type | description |
   |-------|------|------------|
   | ids[] | Integer | Fitler passengers by IDs. Multiple IDs can be provided using an ampersand separated list. For example, ids[]=1&ids[]=2. |
   | full_name  | String | Filter passengers by full name. |
   | emails[] | String | Filter passengers by emails. Multiple emails can be provided using an ampersand separated list. For example, emails[]=abc@gmail.com&emails[]=def@gmail.com|
   | status    | String | Filter passengers by status. |
   | page | Integer | Filter passengers by page. |
   | per_page | Integer | Filter passengers by this value. |
   
3. Get a passenger's profile 💚 (GET)
   > `http://localhost:3000/api/v1/passengers/{passenger_id}`

   Get a passenger's profile.
   
4. Create a new passenger 💛 (POST)
    > `http://localhost:3000/api/v1/passengers`

    Create a new passenger's profile.
    
5. Update passenger info 💙 (PUT)
   > `http://localhost:3000/api/v1/passengers/{passenger_id}`

   Update passenger details.
   
6. Archive a passenger 💜 (PATCH)
   > `http://localhost:3000/api/v1/passengers/{passenger_id}`

   Change a passenger status.
   
7. Delete a passenger ❤️ (DELETE)
   > `http://localhost:3000/api/v1/passengers/{passenger_id}`

   Delete a passenger.

8. List of passenger bookings 💚 (GET)
   > `http://localhost:3000/api/v1/passengers/{passenger_id}/bookings`

   Returns a list of passenger bookings.

   Query params
   | Param | Type | description |
   |-------|------|------------|
   | ids[] | Integer | Fitler bookings by IDs. Multiple IDs can be provided using an ampersand separated list. For example, ids[]=1&ids[]=2. |
   | flights[]  | Integer | Fitler bookings by flights. Multiple IDs of flights can be provided using an ampersand separated list. For example, flights[]=1&flights[]=2. |
   | passengers[] | String | Filter bookings by passengers. Multiple IDs of passengers can be provided using an ampersand separated list. For example, passengers[]=1&passengers[]=2|
   | status    | String | Filter bookings by status. |
   | page | Integer | Filter bookings by page. |
   | per_page | Integer | Filter bookings by this value. |
   

### Flight service

1. List all flights 💚 (GET)
   > `http://localhost:3000/api/v1/flights`

   Returns a list of flights.

   Query params
   | Param | Type | description |
   |-------|------|------------|
   | ids[] | Integer | Fitler flights by IDs. Multiple IDs can be provided using an ampersand separated list. For example, ids[]=1&ids[]=2. |
   | from  | Integer | Filter flights by place of departure. Provide an airport id. |
   | to    | Integer | Filter flights by place of arrival. Provide an airport id. |
   | departure | Date | Filter flights on this value. |
   | arrival | Date | Filter flights on this value. |
   | page | Integer | Filter flights by page. |
   | per_page | Integer | Filter flights by this value. |
   
3. Get flight info 💚 (GET)
   > `http://localhost:3000/api/v1/flights/{flight_id}`

   Get flight details.
   
4. Create a flight 💛 (POST)
   > `http://localhost:3000/api/v1/flights`

   Create a new flight.
   
5. Delete a flight ❤️ (DELETE)
   > `http://localhost:3000/api/v1/flights/{flight_id}`

   Delete a flight.
   
6. Update a flight info 💙 (PUT)
   > `http://localhost:3000/api/v1/flights/{flight_id}`

   Update flight details.

7. List of flight passengers 💚 (GET)
   > `http://localhost:3000/api/v1/flights/{flight_id}/passengers`

   Returns a list of flight passengers.

   Query params
   | Param | Type | description |
   |-------|------|------------|
   | ids[] | Integer | Fitler passengers by IDs. Multiple IDs can be provided using an ampersand separated list. For example, ids[]=1&ids[]=2. |
   | full_name  | String | Filter passengers by full name. |
   | emails[] | String | Filter passengers by emails. Multiple emails can be provided using an ampersand separated list. For example, emails[]=abc@gmail.com&emails[]=def@gmail.com|
   | status    | String | Filter passengers by status. |
   | page | Integer | Filter passengers by page. |
   | per_page | Integer | Filter passengers by this value. |

### Booking service

1. Book a flight 💛 (POST)
   > `http://localhost:3000/api/v1/bookings`

   Create a new booking.
   
2. List all booked flights 💚 (GET)
   > `http://localhost:3000/api/v1/bookings`

   Returns a list of booked flights.

   Query params
   | Param | Type | description |
   |-------|------|------------|
   | ids[] | Integer | Fitler bookings by IDs. Multiple IDs can be provided using an ampersand separated list. For example, ids[]=1&ids[]=2. |
   | flights[]  | Integer | Fitler bookings by flights. Multiple IDs of flights can be provided using an ampersand separated list. For example, flights[]=1&flights[]=2. |
   | passengers[] | String | Filter bookings by passengers. Multiple IDs of passengers can be provided using an ampersand separated list. For example, passengers[]=1&passengers[]=2|
   | status    | String | Filter bookings by status. |
   | page | Integer | Filter bookings by page. |
   | per_page | Integer | Filter bookings by this value. |
   
4. Get booking info 💚 (GET)
   > `http://localhost:3000/api/v1/bookings/{booking_id}`

   Get booking details.
   
5. Update booking 💙 (PUT)
   > `http://localhost:3000/api/v1/bookings/{booking_id}`

   Update booking info.
   
6. Change the booking status 💜 (PATCH)
   > `http://localhost:3000/api/v1/bookings/{booking_id}`

   Change the booking status.
   
7. Delete booking ❤️ (DELETE)
   > `http://localhost:3000/api/v1/bookings/{booking_id}`

   Delete the booking.
   

