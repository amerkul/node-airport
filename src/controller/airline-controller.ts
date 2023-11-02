import { Request, Response, NextFunction } from "express";
import CustomError from "../exception/custom-error";
import { airlineService } from "../service/airline-service";
import { Airline } from "../model/airline";
import { AirlineFilter } from "../model/filter/airline-filter";
import { CreateAirlineDto } from "../dto/create-airline-dto";
import { UpdateAirlineDto } from "../dto/update-airline-dto";

class AirlineController {

    async getAll(req: Request, res: Response, next: NextFunction) {
        try {
            const filter: AirlineFilter = JSON.parse(JSON.stringify(req.query));
            res.send(await airlineService.retrieveByFilter(filter, ((filter.page - 1) * filter.per_page)  || 0, filter.per_page || 10));
        } catch(err: any) {
            next(new CustomError(err.code || 500, err.message));
        }
    }

    async getById(req: Request, res: Response, next: NextFunction) {
        try {
            const id = parseInt(req.params.airline_id);
            res.send(await airlineService.retrieveById(id));
        } catch(err: any) {
            next(new CustomError(err.code || 500, err.message));
        }
    }

    async create(req: Request, res: Response, next: NextFunction) {
        try {
            const airportId = parseInt(req.params.airport_id);
            const body: CreateAirlineDto = req.body;
            const airline: Airline = {...body}
            res.status(201).send(await airlineService.create(airline, airportId));
        } catch(err: any) {
            next(new CustomError(err.code || 500, err.message));
        }
    }

    async update(req: Request, res: Response, next: NextFunction) {
        try {
            const body: UpdateAirlineDto = req.body;
            const newData: Airline = {...body};
            const id = parseInt(req.params.airline_id);
            res.send(await airlineService.update(newData, id));
        } catch(err: any) {
            next(new CustomError(err.code || 500, err.message));
        }
    }

    async deleteById(req: Request, res: Response, next: NextFunction) {
        try {
            const id = parseInt(req.params.airline_id);
            await airlineService.delete(id);
            res.sendStatus(204);
        } catch(err: any) {
            next(new CustomError(err.code || 500, err.message));
        }
    }

    async getAirportAirlines(req: Request, res: Response, next: NextFunction) {
        try {
            const airportId = parseInt(req.params.airport_id);
            const filter: AirlineFilter = JSON.parse(JSON.stringify(req.query));
            filter.airportId = airportId;
            res.send(await airlineService.retrieveByFilter(filter, ((filter.page - 1) * filter.per_page)  || 0, filter.per_page || 10));
        } catch(err: any) {
            next(new CustomError(err.code || 500, err.message));
        }
    }

}

export const airlineController = new AirlineController();
