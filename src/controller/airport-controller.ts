import { NextFunction, Request, Response } from "express";
import { airportService } from "../service/airport-service";
import CustomError from "../exception/custom-error";
import { Airport } from "../model/airport";
import { AirportFilter } from "../model/filter/airport-filter";
import { CreateAirportDto } from "../dto/create-airport-dto";
import { UpdateAirportDto } from "../dto/update-airport-dto";
import { InputValidator } from "./validator/input-validator";
import { Paginator } from "./util/paginator";

class AirportController {


    async getAllByFilter(req: Request, res: Response, next: NextFunction) {
        try {
            const filter: AirportFilter = JSON.parse(JSON.stringify(req.query));
            InputValidator.validateAirportInputOrThrow(filter);
            const page = isNaN(filter.page) ? 1 : filter.page;
            const size = isNaN(filter.per_page) ? 10 : filter.per_page;
            const airports = await airportService.retrieveByFilter(
                filter, 
                Paginator.getOffset(page, size), 
                size);
            const totalEntries: number = await airportService.retrieveTotalEntries(filter);
            res.send({
                airports: airports,
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
            InputValidator.validateIntRouteParamOrThrow(req.params.airport_id);
            const id = parseInt(req.params.airport_id);
            res.send(await airportService.retrieveById(id));
        } catch(err: any) {
            next(new CustomError(err.code || 500, err.message));
        }
    }

    async create(req: Request, res: Response, next: NextFunction) {
        try {
            const body: CreateAirportDto = req.body;
            InputValidator.validateAirportInputOrThrow(body);
            const airport: Airport = {...body};
            airport.archive = false;
            res.status(201).send(await airportService.create(airport));
        } catch(err: any) {
            next(new CustomError(err.code || 500, err.message));
        }
    }

    async update(req: Request, res: Response, next: NextFunction) {
        try {
            InputValidator.validateIntRouteParamOrThrow(req.params.airport_id);
            const id = parseInt(req.params.airport_id);
            const body: UpdateAirportDto = req.body;
            InputValidator.validateAirportInputOrThrow(body);
            const airport: Airport = {...body};
            res.send(await airportService.update(airport, id));
        } catch(err: any) {
            next(new CustomError(err.code || 500, err.message));
        }
    }

    async deleteById(req: Request, res: Response, next: NextFunction) {
        try {
            InputValidator.validateIntRouteParamOrThrow(req.params.airport_id);
            const id = parseInt(req.params.airport_id);
            await airportService.delete(id);
            res.sendStatus(204);
        } catch(err: any) {
            next(new CustomError(err.code || 500, err.message));
        }
    }
    
}

export const airportController = new AirportController();
