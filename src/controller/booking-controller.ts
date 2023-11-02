import { Request, Response, NextFunction } from "express";
import { BookingFilter } from "../model/filter/booking-filter";
import CustomError from "../exception/custom-error";
import { bookingService } from "../service/booking-service";
import AuthenticationUserDetails from "../security/auth-user-details";
import { CreateBookingDto } from "../dto/create-booking-dto";
import { UpdateBookingDto } from "../dto/update-booking-dto";
import { Booking } from "../model/booking";
import { BookingStatus } from "../model/enum/booking-status";
import NotFoundException from "../exception/not-found-exception";

class BookingController {

    async getAll(req: Request, res: Response, next: NextFunction) {
        try {
            const filter: BookingFilter = JSON.parse(JSON.stringify(req.query));
            res.send(await bookingService.retrieveByFilter(filter, ((filter.page - 1) * filter.per_page)  || 0, filter.per_page || 10));
        } catch(err: any) {
            next(new CustomError(err.code || 500, err.message));
        }
    }

    async getById(req: Request, res: Response, next: NextFunction) {
        try {
            const id = parseInt(req.params.booking_id);
            res.send(await bookingService.retrieveById(id));
        } catch(err: any) {
            next(new CustomError(err.code || 500, err.message));
        }
    }

    async create(req: Request, res: Response, next: NextFunction) {
        try {
            const {seat, passenger_id, flight_id}: CreateBookingDto = req.body;
            let booking: Booking = {
                status: BookingStatus.RESERVED,
                seat: seat,
                passenger: {
                    id: passenger_id
                },
                flight: {
                    id: flight_id
                }
            }
            booking = await bookingService.create(booking);
            res.status(201).send(booking);
        } catch(err: any) {
            next(new CustomError(err.code || 500, err.message));
        }
    }

    async update(req: Request, res: Response, next: NextFunction) {
        try {
            const {status, seat}: UpdateBookingDto = req.body;
            const user: AuthenticationUserDetails = res.locals.user;
            const id = parseInt(req.params.user_id);
            if (user.role === 'Passenger' && user.userId !== id) {
                throw new NotFoundException(404, 'Not found');
            }
            const newData: Booking = {
                status: status as BookingStatus,
                seat: seat
            }
            res.send(await bookingService.update(newData, id));
        } catch(err: any) {
            next(new CustomError(err.code || 500, err.message));
        }
    }

    async deleteById(req: Request, res: Response, next: NextFunction) {
        try {
            const id = parseInt(req.params.booking_id);
            await bookingService.delete(id);
            res.sendStatus(204);
        } catch(err: any) {
            next(new CustomError(err.code || 500, err.message));
        }
    }

    async getUserBookings(req: Request, res: Response, next: NextFunction) {
        try {
            const user: AuthenticationUserDetails = res.locals.user;
            const id = parseInt(req.params.user_id);
            if (user.role === 'Passenger' && user.userId !== id) {
                throw new NotFoundException(404, 'Not found');
            }
            const filter: BookingFilter = JSON.parse(JSON.stringify(req.query));
            res.send(await bookingService.retrieveUserBookingsByFilter(filter, id, 
                ((filter.page - 1) * filter.per_page)  || 0, filter.per_page || 10));
        } catch(err: any) {
            next(new CustomError(err.code || 500, err.message));
        }
    }
    
}

export const bookingController = new BookingController();
