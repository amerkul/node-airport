import LoginDto from "../../dto/login-dto";
import InvalidArgumentException from "../../exception/argument-exception";
import { FlightFilter } from "../../model/filter/flight-filter";
import NotFoundException from "../../exception/not-found-exception";

export class InputValidator {

    static validateAirlineInputOrThrow(input: any) {
        const notValidParams: string[] = [];
        if (input.iata !== undefined &&
            !/^[a-zA-Z0-9]{2,3}$/.test(input.iata)) {
                notValidParams.push(`iata = ${input.iata}`);
        }
        if (input.name !== undefined &&
            !/^[a-zA-Z0-9\s]{1,255}$/.test(input.name)) {
                notValidParams.push(`name = ${input.name}`);
        }
        if (input.ids !== undefined &&
            input.ids.filter((id: any) => isNaN(id)).length !== 0) {
                notValidParams.push(`ids = ${input.ids}`);
        }
        if (input.archive!== undefined &&
            !/^true$|^false$/.test(input.archive)) {
                notValidParams.push(`archive = ${input.archive}`);
        }
        if (input.airportId !== undefined &&
            isNaN(new Number(input.airportId) as number)) {
            notValidParams.push(`airportId = ${input.airportId}`);
        }
        if (notValidParams.length !== 0) {
            throw new InvalidArgumentException(400, `Invalid input params ${notValidParams.join(', ')}`);
        }
    }

    static validateAirplaneInputOrThrow(input: any) {
        const notValidParams: string[] = [];
        if (input.capacity !== undefined &&
            (input.capacity < 1 || input.capacity > 500)) {
                notValidParams.push(`capacity = ${input.capacity}`);
        }
        if (input.name !== undefined &&
            !/^[a-zA-Z0-9\s]{1,255}$/.test(input.name)) {
                notValidParams.push(`name = ${input.name}`);
        }
        if (input.archive!== undefined &&
            !/^true$|^false$/.test(input.archive)) {
                notValidParams.push(`archive = ${input.archive}`);
        }
        if (input.ids !== undefined &&
            input.ids.filter((id: any) => isNaN(id)).length !== 0) {
                notValidParams.push(`ids = ${input.ids}`);
        }
        if (input.airlineId !== undefined &&
            isNaN(new Number(input.airlineId) as number)) {
            notValidParams.push(`airlineId = ${input.airlineId}`);
        }
        if (notValidParams.length !== 0) {
            throw new InvalidArgumentException(400, `Invalid input params ${notValidParams.join(', ')}`);
        }
    }

    static validateAirportInputOrThrow(input: any) {
        const notValidParams: string[] = [];
        if (input.iata !== undefined &&
            !/^[a-zA-Z0-9]{3}$/.test(input.iata)) {
                notValidParams.push(`iata = ${input.iata}`);
        }
        if (input.icao !== undefined &&
            !/^[a-zA-Z0-9]{4}$/.test(input.icao)) {
                notValidParams.push(`icao = ${input.icao}`);
        }
        if (input.name !== undefined &&
            !/^[a-zA-Z0-9\s]{1,255}$/.test(input.name)) {
                notValidParams.push(`name = ${input.name}`);
        }
        if (input.country !== undefined &&
            !/^[a-zA-Z\s]{1,50}$/.test(input.country)) {
                notValidParams.push(`country = ${input.country}`);
        }
        if (input.city !== undefined &&
            !/^[a-zA-Z\s]{1,50}$/.test(input.city)) {
                notValidParams.push(`city = ${input.city}`);
        }
        if (input.latitude !== undefined &&
            !/^-?[0-9]{1,3}.[0-9]{1,6}$/.test(input.latitude.toString())) {
                notValidParams.push(`latitude = ${input.latitude}`);
        }
        if (input.longitude !== undefined &&
            !/^-?[0-9]{1,3}.[0-9]{1,6}$/.test(input.longitude.toString())) {
                notValidParams.push(`longitude = ${input.longitude}`);
        }
        if (input.archive!== undefined &&
            !/^true$|^false$/.test(input.archive)) {
                notValidParams.push(`archive = ${input.archive}`);
        }
        if (input.ids !== undefined &&
            input.ids.filter((id: any) => isNaN(id)).length !== 0) {
                notValidParams.push(`ids = ${input.ids}`);
        }
        if (notValidParams.length !== 0) {
            throw new InvalidArgumentException(400, `Invalid input params ${notValidParams.join(', ')}`);
        }
    }

    static validatePassengerInputOrThrow(input: any) {
        const notValidParams: string[] = [];
        if (input.full_name !== undefined &&
            !/^[a-zA-Z0-9\s]{1,255}$/.test(input.full_name)) {
                notValidParams.push(`full name = ${input.full_name}`);
        }
        if (input.passport !== undefined &&
            !/^[A-Z]{2}[0-9]{7}$/.test(input.passport)) {
                notValidParams.push(`passport = ${input.passport}`);
        }
        if (input.birthday !== undefined &&
            !/^([0-9]{2})?[0-9]{2}(\/|-)(1[0-2]|0?[1-9])\2(3[01]|[12][0-9]|0?[1-9])$/.test(input.birthday)) {
                notValidParams.push(`birthday = ${input.birthday}`);
        }
        if (input.email !== undefined &&
            !/^\S+@\S+\.\S+$/.test(input.email)) {
                notValidParams.push(`email = ${input.email}`);
        }
        if (input.userId !== undefined &&
            isNaN(input.userId)) {
                notValidParams.push(`userId = ${input.userId}`);
        }
        if (notValidParams.length !== 0) {
            throw new InvalidArgumentException(400, `Invalid input params ${notValidParams.join(', ')}`);
        }
    }

    static validateUserInputOrThrow(input: any) {
        const notValidParams: string[] = [];
        if (input.username !== undefined &&
            !/^[a-zA-Z0-9.-_@]{1,255}$/.test(input.username)) {
                notValidParams.push(`username = ${input.username}`);
        }
        if (input.password !== undefined &&
            !/^[a-zA-Z0-9.-_@]{3,40}$/.test(input.password)) {
                notValidParams.push(`password = ${input.password}`);
        }
        if (input.firstName !== undefined &&
            !/^[a-zA-Z'\s]{1,255}$/.test(input.firstName)) {
                notValidParams.push(`first name = ${input.firstName}`);
        }
        if (input.lastName !== undefined &&
            !/^[a-zA-Z'\s]{1,255}$/.test(input.lastName)) {
                notValidParams.push(`last name = ${input.lastName}`);
        }
        if (input.passport !== undefined &&
            !/^[A-Z]{2}[0-9]{7}$/.test(input.passport)) {
                notValidParams.push(`passport = ${input.passport}`);
        }
        if (input.birthday !== undefined &&
            input.birthday !== null &&
            !/^([0-9]{2})?[0-9]{2}(\/|-)(1[0-2]|0?[1-9])\2(3[01]|[12][0-9]|0?[1-9])$/.test(input.birthday)) {
                notValidParams.push(`birthday = ${input.birthday}`);
        }
        if (input.email !== undefined &&
            !/^(\S+@\S+\.\S+$){1,255}/.test(input.email)) {
                notValidParams.push(`email = ${input.email}`);
        }
        if (input.phone !== undefined && 
            input.phone !== null &&
            !/^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s./0-9]*$/g.test(input.phone)) {
                notValidParams.push(`phone = ${input.phone}`);
        }
        if (input.sex !== undefined &&
            input.sex !== null && 
            !/^male$|^female$/.test(input.sex)) {
                notValidParams.push(`sex = ${input.sex}`);
        }
        if (input.country !== undefined &&
            input.country !== null &&
            !/^[a-zA-Z\s]{1,50}$/.test(input.country)) {
                notValidParams.push(`country = ${input.country}`);
        }
        if (input.city !== undefined &&
            input.city !== null &&
            !/^[a-zA-Z\s]{1,50}$/.test(input.city)) {
                notValidParams.push(`city = ${input.city}`);
        }
        if (input.zip !== undefined &&
            input.zip !== null &&
            !/^[0-9]{6,15}$/.test(input.zip.toString())) {
                notValidParams.push(`zip = ${input.zip}`);
        }
        if (input.street !== undefined &&
            input.street !== null &&
            !/^[a-zA-Z0-9,-.\s]{1,50}$/.test(input.street)) {
                notValidParams.push(`street = ${input.street}`);
        }
        if (input.active !== undefined &&
            !/^true$|^false$/.test(input.active)) {
                notValidParams.push(`active = ${input.active}`);
        }
        if (input.role !== undefined &&
            !/^Manager$|^Admin$|^Passenger$/.test(input.role)) {
                notValidParams.push(`role = ${input.role}`);
        }
        if (notValidParams.length !== 0) {
            throw new InvalidArgumentException(400, `Invalid input params ${notValidParams.join(', ')}`);
        }
    }

    static validateEmployeeInputOrThrow(input: any) {
        const notValidParams: string[] = [];
        if (input.username !== undefined &&
            !/^[a-zA-Z0-9.-_@]{1,255}$/.test(input.username)) {
                notValidParams.push(`username = ${input.username}`);
        }
        if (input.password !== undefined &&
            !/^[a-zA-Z0-9.-_@]{5,40}$/.test(input.password)) {
                notValidParams.push(`password = ${input.password}`);
        }
        if (input.firstName !== undefined &&
            !/^[a-zA-Z\s']{1,255}$/.test(input.firstName)) {
                notValidParams.push(`first name = ${input.firstName}`);
        }
        if (input.lastName !== undefined &&
            !/^[a-zA-Z\s']{1,255}$/.test(input.lastName)) {
                notValidParams.push(`last name = ${input.lastName}`);
        }
        if (input.full_name !== undefined &&
            !/^[a-zA-Z\s']{1,255}$/.test(input.full_name)) {
                notValidParams.push(`full name = ${input.full_name}`);
        }
        if (input.passport !== undefined &&
            !/^[A-Z]{2}[0-9]{7}$/.test(input.passport)) {
                notValidParams.push(`passport = ${input.passport}`);
        }
        if (input.birthday !== undefined &&
            input.birthday !== null &&
            !/^([0-9]{2})?[0-9]{2}(\/|-)(1[0-2]|0?[1-9])\2(3[01]|[12][0-9]|0?[1-9])$/.test(input.birthday)) {
                notValidParams.push(`birthday = ${input.birthday}`);
        }
        if (input.email !== undefined &&
            !/^\S+@\S+\.\S+$/.test(input.email)) {
                notValidParams.push(`email = ${input.email}`);
        }
        if (input.phone !== undefined && 
            input.phone !== null &&
            !/^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s./0-9]*$/g.test(input.phone)) {
                notValidParams.push(`phone = ${input.phone}`);
        }
        if (input.sex !== undefined &&
            input.sex !== null &&
            !/^male$|^female$/.test(input.sex)) {
                notValidParams.push(`sex = ${input.sex}`);
        }
        if (input.country !== undefined &&
            input.country !== null &&
            !/^[a-zA-Z\s]{1,50}$/.test(input.country)) {
                notValidParams.push(`country = ${input.country}`);
        }
        if (input.city !== undefined &&
            input.city !== null &&
            !/^[a-zA-Z\s]{1,50}$/.test(input.city)) {
                notValidParams.push(`city = ${input.city}`);
        }
        if (input.zip !== undefined &&
            input.zip !== null &&
            !/^[0-9]{6,15}$/.test(input.zip.toString())) {
                notValidParams.push(`zip = ${input.zip}`);
        }
        if (input.street !== undefined &&
            input.street !== null &&
            !/^[a-zA-Z0-9,-.\s]{1,50}$/.test(input.street)) {
                notValidParams.push(`street = ${input.street}`);
        }
        if (input.department !== undefined &&
            !/[^<>]{1,255}/.test(input.department)) {
                notValidParams.push(`department = ${input.department}`);
        }
        if (input.salary !== undefined &&
            !/^[0-9]{1,18}.[0-9]{1,2}$/.test(input.salary.toString())) {
                notValidParams.push(`salary = ${input.salary}`);
        }
        if (input.active !== undefined &&
            !/^true$|^false$/.test(input.active)) {
                notValidParams.push(`active = ${input.active}`);
        }
        if (input.role !== undefined &&
            !/^Manager$|^Admin$/.test(input.role)) {
                notValidParams.push(`role = ${input.role}`);
        }
        if (notValidParams.length !== 0) {
            throw new InvalidArgumentException(400, `Invalid input params ${notValidParams.join(', ')}`);
        }
    }

    static validateBookingInputOrThrow(input: any) {
        const notValidParams: string[] = [];
        if (input.seat !== undefined &&
            (input.seat < 1 || input.seat > 500)) {
                notValidParams.push(`seat = ${input.seat}`);
        }
        if (input.status !== undefined &&
            !/^Reserved$|^Cancelled$/.test(input.status)) {
                notValidParams.push(`status = ${input.status}`);
        }
        if (input.ids !== undefined &&
            input.ids.filter((id: any) => isNaN(id)).length !== 0) {
                notValidParams.push(`ids = ${input.ids}`);
        }
        if (input.passengerId !== undefined &&
            isNaN(new Number(input.passengerId) as number)) {
            notValidParams.push(`passengerId = ${input.passengerId}`);
        }
        if (input.flightId !== undefined &&
            isNaN(new Number(input.flightId) as number)) {
            notValidParams.push(`flightId = ${input.flightId}`);
        }
        if (notValidParams.length !== 0) {
            throw new InvalidArgumentException(400, `Invalid input params ${notValidParams.join(', ')}`);
        }
    }

    static validateLoginInputOrThrow(input: LoginDto) {
        const notValidParams: string[] = [];
        if (input.username !== undefined &&
            !/^[a-zA-Z0-9.-_@]{1,255}$/.test(input.username)) {
                notValidParams.push(`username = ${input.username}`);
        }
        if (input.password !== undefined &&
            !/^[a-zA-Z0-9.-_@]{3,40}$/.test(input.password)) {
                notValidParams.push(`password = ${input.password}`);
        }
        if (notValidParams.length !== 0) {
            throw new InvalidArgumentException(400, `Invalid input params ${notValidParams.join(', ')}`);
        }
    }

    static validateFlightInputOrThrow(input: any) {
        const notValidParams: string[] = [];
        if (input.price !== undefined &&
            !/^[0-9]{1,18}.[0-9]{1,2}$/.test(input.price.toString())) {
                notValidParams.push(`price = ${input.price.toString()}`);
        }
        if (input.arrival !== undefined &&
            new Date(input.arrival).toString() === 'Invalid Date') {
                notValidParams.push(`arrival = ${input.arrival}`);
        }
        if (input.depature !== undefined &&
            new Date(input.depature).toString() === 'Invalid Date') {
                notValidParams.push(`depature = ${input.depature}`);
        }
        if (input.airline_id !== undefined &&
            isNaN(input.airline_id)) {
                notValidParams.push(`airline_id = ${input.airline_id}`);
        }
        if (input.airplane_id !== undefined &&
            isNaN(input.airplane_id)) {
                notValidParams.push(`airplane_id = ${input.airplane_id}`);
        }
        if (input.from_id !== undefined &&
            isNaN(input.from_id)) {
                notValidParams.push(`from id = ${input.from_id}`);
        }
        if (input.to_id !== undefined &&
            isNaN(input.to_id)) {
                notValidParams.push(`to id = ${input.to_id}`);
        }
        if (input.status !== undefined &&
            !/^Scheduled$|^Delayed$|^Departed$|^In Air$|^Arrived$|^Cancelled$/.test(input.status)) {
                notValidParams.push(`status = ${input.status}`);
        }
        if (notValidParams.length !== 0) {
            throw new InvalidArgumentException(400, `Invalid input params ${notValidParams.join(', ')}`);
        }
    }

    static validateFlightFilterInputOrThrow(input: FlightFilter) {
        const notValidParams: string[] = [];
        if (input.arrivalDate !== undefined &&
            new Date(input.arrivalDate).toString() === 'Invalid Date') {
                notValidParams.push(`arrival = ${input.arrivalDate}`);
        }
        if (input.depatureDate !== undefined &&
            new Date(input.depatureDate).toString() === 'Invalid Date') {
                notValidParams.push(`depature = ${input.depatureDate}`);
        }
        if (input.fromCity !== undefined &&
            !/^[a-zA-Z0-9\s]{1,50}$/.test(input.fromCity)) {
                notValidParams.push(`from city = ${input.fromCity}`);
        }
        if (input.fromCountry !== undefined &&
            !/^[a-zA-Z0-9\s]{1,50}$/.test(input.fromCountry)) {
                notValidParams.push(`from country = ${input.fromCountry}`);
        }
        if (input.toCity !== undefined &&
            !/^[a-zA-Z0-9\s]{1,50}$/.test(input.toCity)) {
                notValidParams.push(`to city = ${input.toCity}`);
        }
        if (input.toCountry !== undefined &&
            !/^[a-zA-Z0-9\s]{1,50}$/.test(input.toCountry)) {
                notValidParams.push(`to country = ${input.toCountry}`);
        }
        if (input.ids !== undefined &&
            input.ids.filter(id => isNaN(id)).length !== 0) {
                notValidParams.push(`ids = ${input.ids}`);
        }
        if (input.airplaneId !== undefined &&
            isNaN(input.airplaneId)) {
                notValidParams.push(`airplaneId = ${input.airplaneId}`);
        }
        if (input.status !== undefined &&
            !/^Scheduled$|^Delayed$|^Departed$|^In Air$|^Arrived$|^Cancelled$/.test(input.status)) {
                notValidParams.push(`status = ${input.status}`);
        }
        if (notValidParams.length !== 0) {
            throw new InvalidArgumentException(400, `Invalid input params ${notValidParams.join(', ')}`);
        }
    }

    static validateIntRouteParamOrThrow(input: string) {
        if (isNaN(new Number(input) as number)) {
            throw new NotFoundException(404, `Not found`);
        }
    }

}
