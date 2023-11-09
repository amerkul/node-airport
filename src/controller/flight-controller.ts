import { Request, Response, NextFunction } from "express";
import { FlightFilter } from "../model/filter/flight-filter";
import { flightService } from "../service/flight-service";
import CustomError from "../exception/custom-error";
import { Flight } from "../model/flight";
import { CreateFlightDto } from "../dto/create-flight-dto";
import { UpdateFlightDto } from "../dto/update-flight-dto";
import { FlightStatus } from "../model/enum/flight-status";
import { Paginator } from "./util/paginator";
import { InputValidator } from "./validator/input-validator";

class FlightController {


    async getAll(req: Request, res: Response, next: NextFunction) {
        try {
            const filter: FlightFilter = JSON.parse(JSON.stringify(req.query));
            InputValidator.validateFlightFilterInputOrThrow(filter);
            const page = isNaN(filter.page) ? 1 : filter.page;
            const size = isNaN(filter.per_page) ? 10 : filter.per_page;
            const flights = await flightService.retrieveByFilter(
                filter, 
                Paginator.getOffset(page, size), 
                size);
            const totalEntries: number = await flightService.retrieveTotalEntries(filter);
            res.send({
                flights: flights,
                page: page,
                per_page: size,
                total_entries: totalEntries as number || 0,
                total_pages: Paginator.getTotalPages(totalEntries, size)
            });
        } catch(err: any) {
            next(new CustomError(err.code || 500, err.message));
        }
    }

    async getById(req: Request, res: Response, next: NextFunction) {
        try {
            InputValidator.validateIntRouteParamOrThrow(req.params.flight_id);
            const id = parseInt(req.params.flight_id);
            res.send(await flightService.retrieveById(id));
        } catch(err: any) {
            next(new CustomError(err.code || 500, err.message));
        }
    }

    async create(req: Request, res: Response, next: NextFunction) {
        try {
            const body: CreateFlightDto = req.body;
            InputValidator.validateFlightInputOrThrow(body);
            const flight: Flight = {
                from: {
                    id: body.from_id
                }, 
                to: {
                    id: body.to_id
                },
                price: body.price,
                arrival: body.arrival,
                depature: body.depature,
                airline: {
                    id: body.airline_id
                },
                airplane: {
                    id: body.airplane_id
                }
            }
            res.status(201).send(await flightService.create(flight));
        } catch(err: any) {
            next(new CustomError(err.code || 500, err.message));
        }
    }

    async update(req: Request, res: Response, next: NextFunction) {
        try {
            InputValidator.validateIntRouteParamOrThrow(req.params.flight_id);
            const id = parseInt(req.params.flight_id);
            const body: UpdateFlightDto = req.body;
            InputValidator.validateFlightInputOrThrow(body);
            const flight = await flightService.retrieveById(id);
            const newData: Flight = {
                id: id,
                from: {
                    id: body.from_id || flight.from?.id
                }, 
                to: {
                    id: body.to_id || flight.to?.id
                },
                status: body.status as FlightStatus || flight.status,
                price: body.price || flight.price,
                arrival: body.arrival || flight.arrival,
                depature: body.depature || flight.depature,
                airline: {
                    id: body.airline_id || flight.airline?.id
                },
                airplane: {
                    id: body.airplane_id || flight.airplane?.id
                }
            }
            console.log(newData);
            res.send(await flightService.update(newData));
        } catch(err: any) {
            next(new CustomError(err.code || 500, err.message));
        }
    }

    async deleteById(req: Request, res: Response, next: NextFunction) {
        try {
            InputValidator.validateIntRouteParamOrThrow(req.params.flight_id);
            const id = parseInt(req.params.flight_id);
            await flightService.delete(id);
            res.sendStatus(204);
        } catch(err: any) {
            next(new CustomError(err.code || 500, err.message));
        }
    }

    async getAirplaneFlights(req: Request, res: Response, next: NextFunction) {
        try {
            InputValidator.validateIntRouteParamOrThrow(req.params.airplane_id);
            const airplaneId = parseInt(req.params.airplane_id);
            const filter: FlightFilter = JSON.parse(JSON.stringify(req.query));
            filter.airplaneId = airplaneId;
            InputValidator.validateFlightFilterInputOrThrow(filter);
            const page = isNaN(filter.page) ? 1 : filter.page;
            const size = isNaN(filter.per_page) ? 10 : filter.per_page;
            const flights = await flightService.retrieveByFilter(
                filter, 
                Paginator.getOffset(page, size), 
                size);
            const totalEntries: number = await flightService.retrieveTotalEntries(filter);
            res.send({
                flights: flights,
                page: page,
                per_page: size,
                total_entries: totalEntries as number || 0,
                total_pages: Paginator.getTotalPages(totalEntries, size)
            });
        } catch(err: any) {
            next(new CustomError(err.code || 500, err.message));
        }
    }

    async getFlightsFromStartPlaceToDestination(req: Request, res: Response, next: NextFunction) {
        try {
            const filter: FlightFilter = JSON.parse(JSON.stringify(req.query));
            InputValidator.validateFlightFilterInputOrThrow(filter);
            const flights = await flightService.retrieveAllWays(filter);
            res.send(flights);
        } catch(err: any) {
            next(new CustomError(err.code || 500, err.message));
        }
    }
    
}

export const flightController = new FlightController();
