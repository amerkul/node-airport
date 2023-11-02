import { Request, Response, NextFunction } from "express";
import { FlightFilter } from "../model/filter/flight-filter";
import { flightService } from "../service/flight-service";
import CustomError from "../exception/custom-error";
import { Flight } from "../model/flight";
import { CreateFlightDto } from "../dto/create-flight-dto";
import { UpdateFlightDto } from "../dto/update-flight-dto";
import { FlightStatus } from "../model/enum/flight-status";

class FlightController {

    async getAll(req: Request, res: Response, next: NextFunction) {
        try {
            const filter: FlightFilter = JSON.parse(JSON.stringify(req.query));
            res.send(await flightService.retrieveByFilter(filter, ((filter.page - 1) * filter.per_page)  || 0, filter.per_page || 10));
        } catch(err: any) {
            next(new CustomError(err.code || 500, err.message));
        }
    }

    async getById(req: Request, res: Response, next: NextFunction) {
        try {
            const id = parseInt(req.params.flight_id);
            res.send(await flightService.retrieveById(id));
        } catch(err: any) {
            next(new CustomError(err.code || 500, err.message));
        }
    }

    async create(req: Request, res: Response, next: NextFunction) {
        try {
            const body: CreateFlightDto = req.body;
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
            const body: UpdateFlightDto = req.body;
            const newData: Flight = {
                from: {
                    id: body.from_id
                }, 
                to: {
                    id: body.to_id
                },
                status: body.status as FlightStatus,
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
            const id = parseInt(req.params.flight_id);
            res.send(await flightService.update(newData, id));
        } catch(err: any) {
            next(new CustomError(err.code || 500, err.message));
        }
    }

    async deleteById(req: Request, res: Response, next: NextFunction) {
        try {
            const id = parseInt(req.params.flight_id);
            await flightService.delete(id);
            res.sendStatus(204);
        } catch(err: any) {
            next(new CustomError(err.code || 500, err.message));
        }
    }

    async getAirplaneFlights(req: Request, res: Response, next: NextFunction) {
        try {
            const airplaneId = parseInt(req.params.airplane_id)
            const filter: FlightFilter = JSON.parse(JSON.stringify(req.query));
            filter.airplaneId = airplaneId
            res.send(await flightService.retrieveByFilter(filter, ((filter.page - 1) * filter.per_page)  || 0, filter.per_page || 10));
        } catch(err: any) {
            next(new CustomError(err.code || 500, err.message));
        }
    }

    async getFlightsFromStartPlaceToDestination(req: Request, res: Response, next: NextFunction) {
        try {
            const filter: FlightFilter = JSON.parse(JSON.stringify(req.query));
            res.send(await flightService.retrieveAllWays(filter, ((filter.page - 1) * filter.per_page)  || 0, filter.per_page || 10));
        } catch(err: any) {
            next(new CustomError(err.code || 500, err.message));
        }
    }
    
}

export const flightController = new FlightController();
