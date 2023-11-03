import { Airport } from "../../model/airport";
import InvalidArgumentException from "../../exception/argument-exception"
import { Airline } from "../../model/airline";

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

}
