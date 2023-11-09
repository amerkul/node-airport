import { Airport } from "../../model/airport";
import InvalidArgumentException from "../../exception/argument-exception"
import { Airline } from "../../model/airline";
import { Airplane } from "../../model/airplane";
import User from "../../model/user";
import { Employee } from "../../model/employee";
import { Passenger } from "../../model/passenger";
import { Flight } from "../../model/flight";
import { Booking } from "../../model/booking";
import { FlightFilter } from "../../model/filter/flight-filter";

export class Validator {

    checkUniqueAirportParamsOrThrow(uniqueAirports: Airport[], current: Airport) {
        const notUniqueParams: string[] = []
        if (current.name !== undefined 
            && uniqueAirports.map(unique => unique.name).includes(current.name)) {
            notUniqueParams.push(current.name);
        }
        if (current.iata !== undefined 
            && uniqueAirports.map(unique => unique.iata).includes(current.iata)) {
                notUniqueParams.push(current.iata);
        }
        if (current.icao !== undefined 
            && uniqueAirports.map(unique => unique.icao).includes(current.icao)) {
                notUniqueParams.push(current.icao);
        }
        if (notUniqueParams.length > 0) {
            throw new InvalidArgumentException(400, `Not unique params  
            ${notUniqueParams.join(', ')}`);
        } 
    }

    checkRequiredAirportParamsOrThrow(airport: Airport) {
        if (airport.name === undefined ||
            airport.iata === undefined ||
            airport.icao === undefined || 
            airport.country === undefined ||
            airport.city === undefined) {
            throw new InvalidArgumentException(400, `Some of required values are undefined 
            name = ${airport.name}, iata = ${airport.iata}, icao = ${airport.icao}, 
            country = ${airport.country}, city = ${airport.city}`);
        }
    }

    checkUniqueAirlineParamsOrThrow(uniqueAirlines: Airline[], current: Airline) {
        const notUniqueParams: string[] = []
        if (current.name !== undefined 
            && uniqueAirlines.map(unique => unique.name).includes(current.name)) {
            notUniqueParams.push(current.name);
        }
        if (current.iata !== undefined 
            && uniqueAirlines.map(unique => unique.iata).includes(current.iata)) {
                notUniqueParams.push(current.iata);
        }
        if (notUniqueParams.length > 0) {
            throw new InvalidArgumentException(400, `Not unique params  
            ${notUniqueParams.join(', ')}`);
        } 
    }

    checkRequiredAirlineParamsOrThrow(airline: Airline) {
        if (airline.name === undefined ||
            airline.iata === undefined) {
            throw new InvalidArgumentException(400, `Some of required values are undefined 
            name = ${airline.name}, iata = ${airline.iata}`);
        }
    }

    checkUniqueAirplaneParamsOrThrow(uniqueAirplanes: Airplane[], current: Airplane) {
        const notUniqueParams: string[] = []
        if (current.name !== undefined 
            && uniqueAirplanes.map(unique => unique.name).includes(current.name)) {
            notUniqueParams.push(current.name);
        }
        if (notUniqueParams.length > 0) {
            throw new InvalidArgumentException(400, `Not unique params  
            ${notUniqueParams.join(', ')}`);
        } 
    }

    checkRequiredAirplaneParamsOrThrow(airplane: Airplane) {
        if (airplane.name === undefined ||
            airplane.capacity === undefined) {
            throw new InvalidArgumentException(400, `Some of required values are undefined 
            name = ${airplane.name}, capacity = ${airplane.capacity}`);
        }
    }

    checkUniqueUserParamsOrThrow(uniqueUsers: User[], current: User) {
        const notUniqueParams: string[] = []
        if (current.email !== undefined 
            && uniqueUsers.map(unique => unique.email).includes(current.email)) {
            notUniqueParams.push(current.email);
        }
        if (current.passport !== undefined 
            && uniqueUsers.map(unique => unique.passport).includes(current.passport)) {
            notUniqueParams.push(current.passport);
        }
        if (current.username !== undefined 
            && uniqueUsers.map(unique => unique.username).includes(current.username)) {
            notUniqueParams.push(current.username);
        }
        if (notUniqueParams.length > 0) {
            throw new InvalidArgumentException(400, `Not unique params  
            ${notUniqueParams.join(', ')}`);
        } 
    }

    checkRequiredUserParamsOrThrow(user: User) {
        if (user.username === undefined ||
            user.passport === undefined ||
            user.password === undefined || 
            user.firstName === undefined ||
            user.lastName === undefined ||
            user.email === undefined ||
            user.fullName === undefined || 
            user.role === undefined) {
            throw new InvalidArgumentException(400, `Some of required values are undefined 
            username = ${user.username}, passport = ${user.passport},
            password = ${user.password}, first_name = ${user.firstName},
            last_name = ${user.lastName}, email = ${user.email}, full_name = ${user.fullName},
            role = ${user.role}`);
        }
    }

    checkUniqueEmployeeParamsOrThrow(uniqueEmployees: Employee[], current: Employee) {
        const notUniqueParams: string[] = []
        if (current.user !== undefined ) {
            this.checkUniqueUserParamsOrThrow(uniqueEmployees.map(u => u.user), current.user) 
        }
        if (current.user.id !== undefined 
            && uniqueEmployees.map(unique => unique.user.id).includes(current.user.id)) {
            notUniqueParams.push('user_id');
        }
        if (notUniqueParams.length > 0) {
            throw new InvalidArgumentException(400, `Not unique params  
            ${notUniqueParams.join(', ')}`);
        } 
    }

    checkRequiredEmployeeParamsOrThrow(employee: Employee) {
        this.checkRequiredUserParamsOrThrow(employee.user);
        if (employee.department === undefined) {
            throw new InvalidArgumentException(400, `Some of required values are undefined 
            department = ${employee.department}`);
        }
    }

    checkRequiredPassengerParamsOrThrow(passenger: Passenger) {
        if (passenger.fullName === undefined ||
            passenger.birthday === undefined ||
            passenger.email === undefined ||
            passenger.passport === undefined) {
            throw new InvalidArgumentException(400, `Some of required values are undefined 
            fullname = ${passenger.fullName}, birthday = ${passenger.birthday},
            email = ${passenger.email}, passport = ${passenger.passport}`);
        }
    }

    checkRequiredFlightParamsOrThrow(flight: Flight) {
        if (flight.depature === undefined ||
            flight.arrival === undefined ||
            flight.price === undefined ||
            flight.from?.id === undefined ||
            flight.to?.id === undefined ||
            flight.airplane?.id === undefined || 
            flight.airline?.id === undefined) {
            throw new InvalidArgumentException(400, `Some of required values are undefined 
            depature = ${flight.depature}, arrival = ${flight.arrival},
            price = ${flight.price}, from = ${flight.from?.id},
            to = ${flight.to?.id}, airplane = ${flight.airplane?.id},
            airline = ${flight.airline?.id}`);
        }
    }

    checkRequiredSearchFlightParamsOrThrow(flight: FlightFilter) {
        if (flight.toCity === undefined ||
            flight.fromCity === undefined ||
            flight.toCountry === undefined ||
            flight.fromCountry === undefined ||
            flight.arrivalDate === undefined ||
            flight.depatureDate === undefined) {
            throw new InvalidArgumentException(400, `Some of required values are undefined 
            depature = ${flight.depatureDate}, arrival = ${flight.arrivalDate}, from country= ${flight.fromCountry},
            to country = ${flight.toCountry}, from city = ${flight.fromCity},
            to city = ${flight.toCity}`);
        }
    }

    checkRequiredBookingParamsOrThrow(booking: Booking) {
        if (booking.seat === undefined ||
            booking.passenger?.id === undefined ||
            booking.flight?.id === undefined) {
            throw new InvalidArgumentException(400, `Some of required values are undefined 
            seat = ${booking.seat}, passenger = ${booking.passenger?.id},
            flight = ${booking.flight?.id}`);
        }
    }

}
