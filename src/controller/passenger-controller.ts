import { Request, Response, NextFunction } from "express";
import { PassengerFilter } from "../model/filter/passenger-filter";
import { passengerService } from "../service/passenger-service";
import CustomError from "../exception/custom-error";
import { Passenger } from "../model/passenger";
import { CreatePassengerDto } from "../dto/create-passenger-dto";
import { UpdatePassengerDto } from "../dto/update-passenger-dto";
import { InputValidator } from "./validator/input-validator";
import AuthenticationUserDetails from "../security/auth-user-details";
import NotFoundException from "../exception/not-found-exception";
import { Paginator } from "./util/paginator";

class PassengerController {


    async getAll(req: Request, res: Response, next: NextFunction) {
        try {
            const filter: PassengerFilter = JSON.parse(JSON.stringify(req.query));
            InputValidator.validatePassengerInputOrThrow(filter);
            const page = isNaN(filter.page) ? 1 : filter.page;
            const size = isNaN(filter.per_page) ? 10 : filter.per_page;
            const users = await passengerService.retrieveByFilter(
                filter, 
                Paginator.getOffset(page, size), 
                size);
            const totalEntries: number = await passengerService.retrieveTotalEntries(filter);
            res.send({
                passengers: users,
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
            InputValidator.validateIntRouteParamOrThrow(req.params.passenger_id);
            const id = parseInt(req.params.passenger_id);
            res.send(await passengerService.retrieveById(id));
        } catch(err: any) {
            next(new CustomError(err.code || 500, err.message));
        }
    }

    async create(req: Request, res: Response, next: NextFunction) {
        try {
            const user: AuthenticationUserDetails = res.locals.user;
            const body: CreatePassengerDto = req.body;
            InputValidator.validatePassengerInputOrThrow(body);
            if (body.userId === undefined) {
                throw new CustomError(400, "User id is required");
            }
            if (user.role === 'Passenger' && user.userId != body.userId) {
                throw new NotFoundException(404, 'Not found');
            }
            const passenger: Passenger = {...body};
            res.status(201).send(await passengerService.create(passenger, body.userId));
        } catch(err: any) {
            next(new CustomError(err.code || 500, err.message));
        }
    }

    async update(req: Request, res: Response, next: NextFunction) {
        try {
            InputValidator.validateIntRouteParamOrThrow(req.params.passenger_id);
            const id = parseInt(req.params.passenger_id);
            const body: UpdatePassengerDto = req.body;
            const passenger = await passengerService.retrieveById(id);
            const user: AuthenticationUserDetails = res.locals.user;
            if (user.role === 'Passenger' && passenger.userId != user.userId) {
                throw new NotFoundException(404, 'Not found');
            }
            InputValidator.validatePassengerInputOrThrow(body);
            const newData: Passenger = {...body};
            res.send(await passengerService.update(newData, id));
        } catch(err: any) {
            next(new CustomError(err.code || 500, err.message));
        }
    }

    async deleteById(req: Request, res: Response, next: NextFunction) {
        try {
            InputValidator.validateIntRouteParamOrThrow(req.params.passenger_id);
            const id = parseInt(req.params.passenger_id);
            const passenger = await passengerService.retrieveById(id);
            const user: AuthenticationUserDetails = res.locals.user;
            if (user.role === 'Passenger' && passenger.userId !== user.userId) {
                throw new NotFoundException(404, 'Not found');
            }
            await passengerService.delete(id);
            res.sendStatus(204);
        } catch(err: any) {
            next(new CustomError(err.code || 500, err.message));
        }
    }
    
}

export const passengerController = new PassengerController();
