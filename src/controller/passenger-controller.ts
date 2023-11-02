import { Request, Response, NextFunction } from "express";
import { PassengerFilter } from "../model/filter/passenger-filter";
import { passengerService } from "../service/passenger-service";
import CustomError from "../exception/custom-error";
import { Passenger } from "../model/passenger";
import { CreatePassengerDto } from "../dto/create-passenger-dto";
import { UpdatePassengerDto } from "../dto/update-passenger-dto";

class PassengerController {

    async getAll(req: Request, res: Response, next: NextFunction) {
        try {
            const filter: PassengerFilter = JSON.parse(JSON.stringify(req.query));
            res.send(await passengerService.retrieveByFilter(filter, ((filter.page - 1) * filter.per_page)  || 0, filter.per_page || 10));
        } catch(err: any) {
            next(new CustomError(err.code || 500, err.message));
        }
    }

    async getById(req: Request, res: Response, next: NextFunction) {
        try {
            const id = parseInt(req.params.passenger_id);
            res.send(await passengerService.retrieveById(id));
        } catch(err: any) {
            next(new CustomError(err.code || 500, err.message));
        }
    }

    async create(req: Request, res: Response, next: NextFunction) {
        try {
            const body: CreatePassengerDto = req.body;
            const passenger: Passenger = {...body};
            res.status(201).send(await passengerService.create(passenger, body.user_id || null));
        } catch(err: any) {
            next(new CustomError(err.code || 500, err.message));
        }
    }

    async update(req: Request, res: Response, next: NextFunction) {
        try {
            const body: UpdatePassengerDto = req.body;
            const id = parseInt(req.params.passenger_id);
            const newData: Passenger = {...body};
            res.send(await passengerService.update(newData, id));
        } catch(err: any) {
            next(new CustomError(err.code || 500, err.message));
        }
    }

    async deleteById(req: Request, res: Response, next: NextFunction) {
        try {
            const id = parseInt(req.params.passenger_id);
            await passengerService.delete(id);
            res.sendStatus(204);
        } catch(err: any) {
            next(new CustomError(err.code || 500, err.message));
        }
    }
    
}

export const passengerController = new PassengerController();
