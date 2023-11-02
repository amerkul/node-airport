import { Request, Response, NextFunction } from "express";
import { AirplaneFilter } from "../model/filter/airplane-filter";
import CustomError from "../exception/custom-error";
import { airplaneService } from "../service/airplane-service";
import { Airplane } from "../model/airplane";
import { CreateAirplaneDto } from "../dto/create-airplane-dto";
import { UpdateAirplaneDto } from "../dto/update-airplane-dto";

class AirplaneController {

    async getAll(req: Request, res: Response, next: NextFunction) {
        try {
            const filter: AirplaneFilter = JSON.parse(JSON.stringify(req.query));
            res.send(await airplaneService.retrieveByFilter(filter, ((filter.page - 1) * filter.per_page)  || 0, filter.per_page || 10));
        } catch(err: any) {
            next(new CustomError(err.code || 500, err.message));
        }
    }

    async getById(req: Request, res: Response, next: NextFunction) {
        try {
            const id = parseInt(req.params.airplane_id);
            res.send(await airplaneService.retrieveById(id));
        } catch(err: any) {
            next(new CustomError(err.code || 500, err.message));
        }
    }

    async create(req: Request, res: Response, next: NextFunction) {
        try {
            const airlineId = parseInt(req.params.airline_id);
            const body: CreateAirplaneDto = req.body;
            const airplane: Airplane = {...body};
            res.status(201).send(await airplaneService.create(airplane, airlineId));
        } catch(err: any) {
            next(new CustomError(err.code || 500, err.message));
        }
    }

    async update(req: Request, res: Response, next: NextFunction) {
        try {
            const body: UpdateAirplaneDto = req.body;
            const id = parseInt(req.params.airplane_id);
            const newData: Airplane = {...body};
            res.send(await airplaneService.update(newData, id));
        } catch(err: any) {
            next(new CustomError(err.code || 500, err.message));
        }
    }

    async deleteById(req: Request, res: Response, next: NextFunction) {
        try {
            const id = parseInt(req.params.airplane_id);
            await airplaneService.delete(id);
            res.sendStatus(204);
        } catch(err: any) {
            next(new CustomError(err.code || 500, err.message));
        }
    }

    async getAirlineAirplanes(req: Request, res: Response, next: NextFunction) {
        try {
            const airlineId = parseInt(req.params.airline_id);
            const filter: AirplaneFilter = JSON.parse(JSON.stringify(req.query));
            filter.airlineId = airlineId;
            res.send(await airplaneService.retrieveByFilter(filter, ((filter.page - 1) * filter.per_page)  || 0, filter.per_page || 10));
        } catch(err: any) {
            next(new CustomError(err.code || 500, err.message));
        }
    }

}

export const airplaneController = new AirplaneController();
