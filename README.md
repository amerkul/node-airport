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

### Airports

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

   Responses

   ```json
   {
        "a" : 1
   }
   ```

3. Get airport info 💚 (GET)
   > `http://localhost:3000/api/v1/airports/{airport_id}`

   Get an airport.

   Path params
   | Param | Type | Required |
   |-------|------|------------|
   | airport_id | Integer | True |
   
4. Add the airport data 💛 (POST)
   > `http://localhost:3000/api/v1/airports`

   Create an airport.

   Body params
   | Param | Type | Required |
   |-------|------|------------|
   | name | String | True |
   | country | String | True |
   | city | String | |
   | latitude | Float | |
   | longitude | Float | | 
   
5. Update airport info 💙 (PUT)
   > `http://localhost:3000/api/v1/airports/{airport_id}`

   Update airport details.
   
   Path params
   | Param | Type | Required |
   |-------|------|------------|
   | airport_id | Integer | True |

   Body params
   | Param | Type | Required |
   |-------|------|------------|
   | name | String | |
   | country | String | |
   | city | String | |
   | latitude | Float | |
   | longitude | Float | |
   | archive | Boolean | |
   
6. Delete an airport ❤️ (DELETE)
   > `http://localhost:3000/api/v1/airports/{airport_id}`

   Delete an airport.
   
   Path params
   | Param | Type | Required |
   |-------|------|------------|
   | airport_id | Integer | True |

### Airplanes

1. List all airplanes 💚 (GET)
   > `http://localhost:3000/api/v1/airplanes`

   Returns a list of airplanes.

   Query params
   | Param | Type | description |
   |-------|------|------------|
   | ids[] | String | Fitler airplanes by IDs. Multiple IDs can be provided using an ampersand separated list. For example, ids[]=1&ids[]=2. |
   | page | Integer | Filter airplanes by page. |
   | per_page | Integer | Filter airplanes by this value. |
   
2. Get an airplane 💚 (GET)
   > `http://localhost:3000/api/v1/airplanes/{airplane_id}`

   Get airplane details.

   Path params
   | Param | Type | Required |
   |-------|------|------------|
   | airplane_id | Integer | True |
   
3. Create an airplane 💛 (POST)
   > `http://localhost:3000/api/v1/airplanes`

   Create an airplane.

   Body params
   | Param | Type | Required |
   |-------|------|------------|
   | name | String | True |
   | capacity | Integer | True |
   
4. Update airplane info 💙 (PUT)
   > `http://localhost:3000/api/v1/airplanes/{airplane_id}`

   Update airplane details.

   Path params
   | Param | Type | Required |
   |-------|------|------------|
   | airport_id | Integer | True |

   Body params
   | Param | Type | Required |
   |-------|------|------------|
   | name | String | |
   | capacity | Integer | |
   | archive | Boolean | |
   
5. Delete an airplane ❤️ (DELETE)
   > `http://localhost:3000/api/v1/airplanes/{airplane_id}`

   Delete an airplane.

   Path params
   | Param | Type | Required |
   |-------|------|------------|
   | airport_id | Integer | True |

6. List of airport airplanes 💚 (GET)
   > `http://localhost:3000/api/v1/airports/{airport_id}/airplanes`

   Returns a list of airport airplanes.

   Path params
   | Param | Type | Required |
   |-------|------|------------|
   | airport_id | Integer | True |

   Query params
   | Param | Type | description |
   |-------|------|------------|
   | ids[] | String | Fitler airplanes by IDs. Multiple IDs can be provided using an ampersand separated list. For example, ids[]=1&ids[]=2. |
   | page | Integer | Filter airplanes by page. |
   | per_page | Integer | Filter airplanes by this value. |

### Passengers

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
   
2. Get a passenger's profile 💚 (GET)
   > `http://localhost:3000/api/v1/passengers/{passenger_id}`

   Get a passenger's profile.

   Path params
   | Param | Type | Required |
   |-------|------|------------|
   | passenger_id | Integer | True |
   
3. Create a new passenger 💛 (POST)
    > `http://localhost:3000/api/v1/passengers`

    Create a new passenger's profile.

   Body params
   | Param | Type | Required |
   |-------|------|------------|
   | first_name | String | True |
   | last_name | String | True |
   | email | String | True |
   | passport | String | True |
   | phone | String | |
   | sex | String | |
   | birthday | Date | |
   | country | String | |
   | city | String | |
   | zip | Integer | |
   | street | String | |
    
4. Update passenger info 💙 (PUT)
   > `http://localhost:3000/api/v1/passengers/{passenger_id}`

   Update passenger details.

   Path params
   | Param | Type | Required |
   |-------|------|------------|
   | passenger_id | Integer | True |

   Body params
   | Param | Type | Required |
   |-------|------|------------|
   | first_name | String | |
   | last_name | String | |
   | email | String | |
   | passport | String | |
   | phone | String | |
   | sex | String | |
   | birthday | Date | |
   | country | String | |
   | city | String | |
   | zip | Integer | |
   | street | String | |
   
5. Delete a passenger ❤️ (DELETE)
   > `http://localhost:3000/api/v1/passengers/{passenger_id}`

   Delete a passenger.

   Path params
   | Param | Type | Required |
   |-------|------|------------|
   | passenger_id | Integer | True |

6. List of flight passengers 💚 (GET)
   > `http://localhost:3000/api/v1/flights/{flight_id}/passengers`

   Returns a list of flight passengers.

   Query params
   | Param | Type | description |
   |-------|------|------------|
   | full_name  | String | Filter passengers by full name. |
   | emails[] | String | Filter passengers by emails. Multiple emails can be provided using an ampersand separated list. For example, emails[]=abc@gmail.com&emails[]=def@gmail.com|
   | status    | String | Filter passengers by status. |
   | page | Integer | Filter passengers by page. |
   | per_page | Integer | Filter passengers by this value. |
   

### Flights

1. List all flights 💚 (GET)
   > `http://localhost:3000/api/v1/flights`

   Returns a list of flights.

   Query params
   | Param | Type | description |
   |-------|------|------------|
   | ids[] | Integer | Fitler flights by IDs. Multiple IDs can be provided using an ampersand separated list. For example, ids[]=1&ids[]=2. |
   | from  | Integer | Filter flights by place of departure. Provide an airport id. |
   | to    | Integer | Filter flights by place of arrival. Provide an airport id. |
   | departure | Datetime | Filter flights on or after this value. |
   | arrival | Datetime | Filter flights on or after this value. |
   | page | Integer | Filter flights by page. |
   | per_page | Integer | Filter flights by this value. |
   
2. Get flight info 💚 (GET)
   > `http://localhost:3000/api/v1/flights/{flight_id}`

   Get flight details.

   Path params
   | Param | Type | Required |
   |-------|------|------------|
   | flight_id | Integer | True |
   
3. Create a flight 💛 (POST)
   > `http://localhost:3000/api/v1/flights`

   Body params
   | Param | Type | Required |
   |-------|------|------------|
   | from | Integer | True |
   | to | Integer | True |
   | departure | Datetime | True |
   | arrival | Datetime | True |
   | airplane_id | Integer | True |
   | price | Float | True |

   Create a new flight.
   
4. Delete a flight ❤️ (DELETE)
   > `http://localhost:3000/api/v1/flights/{flight_id}`

   Delete a flight.
   
   Path params
   | Param | Type | Required |
   |-------|------|------------|
   | flight_id | Integer | True |
   
5. Update a flight info 💙 (PUT)
   > `http://localhost:3000/api/v1/flights/{flight_id}`

   Update flight details.

   Path params
   | Param | Type | Required |
   |-------|------|------------|
   | flight_id | Integer | True |
   
   Body params
   | Param | Type | Required |
   |-------|------|------------|
   | from | Integer | |
   | to | Integer | |
   | archive | Boolean | |
   | departure | Datetime | |
   | arrival | Datetime | |
   | airplane_id | Integer | |
   | price | Float | |

6. List of airplane flights 💚 (GET)
   > `http://localhost:3000/api/v1/airplanes/{airplane_id}/flights`

   Returns a list of airplane flights.

   Path params
   | Param | Type | Required |
   |-------|------|------------|
   | airplane_id | Integer | True |
   
   Query params
   | Param | Type | description |
   |-------|------|------------|
   | ids[] | Integer | Fitler flights by IDs. Multiple IDs can be provided using an ampersand separated list. For example, ids[]=1&ids[]=2. |
   | from  | Integer | Filter flights by place of departure. Provide an airport id. |
   | to    | Integer | Filter flights by place of arrival. Provide an airport id. |
   | departure | Datetime | Filter flights on or after this value. |
   | arrival | Datetime | Filter flights on or before this value. |
   | page | Integer | Filter flights by page. |
   | per_page | Integer | Filter flights by this value. |
   
### Bookings
   
1. List all booked flights 💚 (GET)
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
   
2. Get booking info 💚 (GET)
   > `http://localhost:3000/api/v1/bookings/{booking_id}`

   Get booking details.

3. Update the booking 💙 (PUT)
   > `http://localhost:3000/api/v1/bookings/{booking_id}`

   Update booking info.

   Path params
   | Param | Type | Required |
   |-------|------|------------|
   | booking_id | Integer | True |

   Body params
   | Param | Type | Required |
   |-------|------|------------|
   | seat | Integer | |
   | status | String | |
   | passenger_name | String | |
   
4. Delete booking ❤️ (DELETE)
   > `http://localhost:3000/api/v1/bookings/{booking_id}`

   Delete the booking.

5. Book a flight 💛 (POST)
   > `http://localhost:3000/api/v1/flights/{flight_id}/bookings`

   Create a new booking.

   Path params
   | Param | Type | Required |
   |-------|------|------------|
   | flight_id | Integer | True |

   Body params
   | Param | Type | Required |
   |-------|------|------------|
   | passenger_id | Integer | True |
   | seat | Integer | True |
   | passenger_name | String | |

6. List of passenger bookings 💚 (GET)
   > `http://localhost:3000/api/v1/passengers/{passenger_id}/bookings`

   Returns a list of passenger bookings.

   Path params
   | Param | Type | Required |
   |-------|------|------------|
   | passenger_id | Integer | True |

   Query params
   | Param | Type | description |
   |-------|------|------------|
   | ids[] | Integer | Fitler bookings by IDs. Multiple IDs can be provided using an ampersand separated list. For example, ids[]=1&ids[]=2. |
   | flights[]  | Integer | Fitler bookings by flights. Multiple IDs of flights can be provided using an ampersand separated list. For example, flights[]=1&flights[]=2. |
   | passengers[] | String | Filter bookings by passengers. Multiple IDs of passengers can be provided using an ampersand separated list. For example, passengers[]=1&passengers[]=2|
   | status    | String | Filter bookings by status. |
   | page | Integer | Filter bookings by page. |
   | per_page | Integer | Filter bookings by this value. |

