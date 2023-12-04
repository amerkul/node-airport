import { Request, Response, NextFunction } from "express";
import { AirplaneFilter } from "../model/filter/airplane-filter";
import CustomError from "../exception/custom-error";
import { airplaneService } from "../service/airplane-service";
import { Airplane } from "../model/airplane";
import { CreateAirplaneDto } from "../dto/create-airplane-dto";
import { UpdateAirplaneDto } from "../dto/update-airplane-dto";
import { Paginator } from "./util/paginator";
import { InputValidator } from "./validator/input-validator";
import { airlineService } from "../service/airline-service";

class AirplaneController {


    async getAll(req: Request, res: Response, next: NextFunction) {
        try {
            const filter: AirplaneFilter = JSON.parse(JSON.stringify(req.query));
            InputValidator.validateAirplaneInputOrThrow(filter);
            const page = isNaN(filter.page) ? 1 : filter.page;
            const size = isNaN(filter.per_page) ? 10 : filter.per_page;
            const airplanes = await airplaneService.retrieveByFilter(
                filter, 
                Paginator.getOffset(page, size), 
                size);
            const totalEntries: number = await airplaneService.retrieveTotalEntries(filter);
            res.send({
                airplanes: airplanes,
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
            InputValidator.validateIntRouteParamOrThrow(req.params.airplane_id);
            const id = parseInt(req.params.airplane_id);
            res.send(await airplaneService.retrieveById(id));
        } catch(err: any) {
            next(new CustomError(err.code || 500, err.message));
        }
    }

    async create(req: Request, res: Response, next: NextFunction) {
        try {
            InputValidator.validateIntRouteParamOrThrow(req.params.airline_id);
            const airlineId = parseInt(req.params.airline_id);
            await airlineService.retrieveById(airlineId);
            const body: CreateAirplaneDto = req.body;
            InputValidator.validateAirplaneInputOrThrow(body);
            const airplane: Airplane = {...body};
            res.status(201).send(await airplaneService.create(airplane, airlineId));
        } catch(err: any) {
            next(new CustomError(err.code || 500, err.message));
        }
    }

    async update(req: Request, res: Response, next: NextFunction) {
        try {
            InputValidator.validateIntRouteParamOrThrow(req.params.airplane_id);
            const id = parseInt(req.params.airplane_id);
            const body: UpdateAirplaneDto = req.body;
            InputValidator.validateAirplaneInputOrThrow(body);
            const newData: Airplane = {...body};
            res.send(await airplaneService.update(newData, id));
        } catch(err: any) {
            next(new CustomError(err.code || 500, err.message));
        }
    }

    async deleteById(req: Request, res: Response, next: NextFunction) {
        try {
            InputValidator.validateIntRouteParamOrThrow(req.params.airplane_id);
            const id = parseInt(req.params.airplane_id);
            await airplaneService.delete(id);
            res.sendStatus(204);
        } catch(err: any) {
            next(new CustomError(err.code || 500, err.message));
        }
    }

    async getAirlineAirplanes(req: Request, res: Response, next: NextFunction) {
        try {
            InputValidator.validateIntRouteParamOrThrow(req.params.airline_id);
            const airlineId = parseInt(req.params.airline_id);
            const filter: AirplaneFilter = JSON.parse(JSON.stringify(req.query));
            filter.airlineId = airlineId;
            InputValidator.validateAirplaneInputOrThrow(filter);
            const page = isNaN(filter.page) ? 1 : filter.page;
            const size = isNaN(filter.per_page) ? 10 : filter.per_page;
            const airplanes = await airplaneService.retrieveByFilter(
                filter, 
                Paginator.getOffset(page, size), 
                size);
            const totalEntries: number = await airplaneService.retrieveTotalEntries(filter);
            res.send({
                airplanes: airplanes,
                page: page,
                per_page: size,
                total_entries: totalEntries as number || 0,
                total_pages: Paginator.getTotalPages(totalEntries, size)
            });
        } catch(err: any) {
            next(new CustomError(err.code || 500, err.message));
        }
    }

}

export const airplaneController = new AirplaneController();
