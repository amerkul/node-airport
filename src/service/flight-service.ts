import InvalidArgumentException from "../exception/argument-exception";
import CustomError from "../exception/custom-error";
import NotFoundException from "../exception/not-found-exception";
import { FlightStatus } from "../model/enum/flight-status";
import { FlightFilter } from "../model/filter/flight-filter";
import { Flight } from "../model/flight";
import { flightRepository } from "../repository/flight-repository";
import { airlineService } from "./airline-service";
import { airplaneService } from "./airplane-service";
import { airportService } from "./airport-service";
import { FlightGraph } from "./util/graph";
import { Validator } from "./validator/service-validator";

class FlightService {

    private validator: Validator = new Validator();

    async retrieveAllWays(filter: FlightFilter): Promise<Flight[]> {
        try {
            this.validator.checkRequiredSearchFlightParamsOrThrow(filter);
            const newFilter = new FlightFilter();
            newFilter.depatureDate = filter.depatureDate;
            newFilter.arrivalDate = filter.arrivalDate;
            newFilter.status = FlightStatus.SCHEDULED;
            const flights: Flight[] = await flightRepository.search(
                newFilter, null, null
            );
            const graph = new FlightGraph ();
            flights.forEach(flight => {
                const fromPlace = `${flight.from?.country}, ${flight.from?.city}`;
                const destination = `${flight.to?.country}, ${flight.to?.city}`;
                graph.addVertexIfAbsent(fromPlace);
                graph.addVertexIfAbsent(destination);
                graph.addEdge(fromPlace, destination, flight);
            });
            const paths = graph.getAllPaths(
                `${filter.fromCountry}, ${filter.fromCity}`, 
                `${filter.toCountry}, ${filter.toCity}`
            );
            return paths.map(path => 
                path.map((step: { weight: any; }) => step.weight)
                    .filter((step: Flight) => !!step)
            );
        } catch (err: any) {
            throw new CustomError(err.code || 500, err.message);
        } 
    }

    async create(flight: Flight): Promise<Flight> {
        try {
            this.validator.checkRequiredFlightParamsOrThrow(flight);
            await Promise.all([
                airportService.retrieveById(flight.from?.id as number), 
                airportService.retrieveById(flight.to?.id as number),
                airplaneService.retrieveById(flight.airplane?.id as number),
                airlineService.retrieveById(flight.airline?.id as number)
            ]);
            if (new Date(flight.depature as string) >= new Date(flight.arrival as string)) {
                throw new InvalidArgumentException(400, "Invalid date range");
            }
            const notFreeAirplanes = await flightRepository.findByUniqueParams(flight);
            if (notFreeAirplanes.length !== 0) {
                throw new InvalidArgumentException(400, `Airplane is not free on this time`);
            } 
            flight.status = FlightStatus.SCHEDULED;
            const flightId = await flightRepository.create(flight);
            flight.id = flightId;
            return flight;
        } catch(err: any) {
            throw new CustomError(err.code || 500, err.message);
        }
    }

    async retrieveById(id: number): Promise<Flight> {
        try {
            const flight = (await flightRepository.findById(id)).shift();
            if (flight === undefined) {
                throw new NotFoundException(404, `Flight with id = ${id} doesn't exist`);
            }
            return flight;
        } catch(err: any) {
            throw new CustomError(err.code || 500, err.message);
        }
    }

    async update(newData: Flight): Promise<Flight> {
        try {
            const notFreeAirplanes = await flightRepository.findByUniqueParams(newData);
            if (notFreeAirplanes.filter(notFree => notFree.id !== newData.id).length !== 0) {
                throw new InvalidArgumentException(400, `Airplane is not free on this time`);
            } 
            await Promise.all([
                airportService.retrieveById(newData.from?.id as number), 
                airportService.retrieveById(newData.to?.id as number),
                airplaneService.retrieveById(newData.airplane?.id as number),
                airlineService.retrieveById(newData.airline?.id as number)
            ]);
            await flightRepository.update(newData);
            return newData;
        } catch(err: any) {
            throw new CustomError(err.code || 500, err.message);
        }
    }

    async delete(id: number): Promise<void> {
        try {
            await flightRepository.delete(id);
        } catch (err: any) {
            throw new CustomError(500, err.message);
        }
    }

    async retrieveTotalEntries(filter: FlightFilter): Promise<number> {
        try {
            return await flightRepository.findTotalEntries(filter);
        } catch(err: any) {
            throw new CustomError(500, err.message);
        }
    }

    async retrieveByFilter(filter: FlightFilter, offset: number, size: number): Promise<Flight[]> {
        try {
            return await flightRepository.search(filter, offset, size);
        } catch(err: any) {
            throw new CustomError(500, err.message);
        }
    }

}

export const flightService = new FlightService();
