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
import { Paginator } from "./util/paginator";
import { InputValidator } from "./validator/input-validator";
import { flightService } from "../service/flight-service";
import InvalidArgumentException from "../exception/argument-exception";

class BookingController {


    async getAll(req: Request, res: Response, next: NextFunction) {
        try {
            const filter: BookingFilter = JSON.parse(JSON.stringify(req.query));
            InputValidator.validateBookingInputOrThrow(filter);
            const page = isNaN(filter.page) ? 1 : filter.page;
            const size = isNaN(filter.per_page) ? 10 : filter.per_page;
            const bookings = await bookingService.retrieveByFilter(
                filter, 
                Paginator.getOffset(page, size), 
                size);
            const totalEntries: number = await bookingService.retrieveTotalEntries(filter);
            res.send({
                bookings: bookings,
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
            InputValidator.validateIntRouteParamOrThrow(req.params.booking_id);
            const id = parseInt(req.params.booking_id);
            res.send(await bookingService.retrieveById(id));
        } catch(err: any) {
            next(new CustomError(err.code || 500, err.message));
        }
    }

    async create(req: Request, res: Response, next: NextFunction) {
        try {
            InputValidator.validateIntRouteParamOrThrow(req.params.flight_id);
            const body: CreateBookingDto = req.body;
            InputValidator.validateBookingInputOrThrow(body);
            let booking: Booking = {
                status: BookingStatus.RESERVED,
                seat: body.seat,
                passenger: {
                    id: body.passengerId
                },
                flight: {
                    id: parseInt(req.params.flight_id)
                }
            }
            const flight = await flightService.retrieveById(parseInt(req.params.flight_id));
            if (flight.airplane?.capacity !== undefined 
                && flight.airplane?.capacity < body.seat) {
                    throw new InvalidArgumentException(400, "Passenger seat is great than airplane's capacity");
            }
            booking = await bookingService.create(booking);
            res.status(201).send(booking);
        } catch(err: any) {
            next(new CustomError(err.code || 500, err.message));
        }
    }

    async update(req: Request, res: Response, next: NextFunction) {
        try {
            InputValidator.validateIntRouteParamOrThrow(req.params.booking_id);
            InputValidator.validateIntRouteParamOrThrow(req.params.user_id);
            const body: UpdateBookingDto = req.body;
            const user: AuthenticationUserDetails = res.locals.user;
            const id = parseInt(req.params.user_id);
            const bookingId = parseInt(req.params.booking_id);
            if (user.role === 'Passenger' && user.userId !== id) {
                throw new NotFoundException(404, 'Not found');
            }
            InputValidator.validateBookingInputOrThrow(body);
            let booking = await bookingService.retrieveById(bookingId);
            const newData: Booking = {
                id: booking.id,
                status: body.status as BookingStatus || booking.status,
                seat: body.seat || booking.seat,
                flight: {
                    id: booking.flight?.id
                },
                passenger:{
                    id: booking.passenger?.id
                }
            }
            const flight = await flightService.retrieveById(newData.flight?.id as number);
            if (body.seat !== undefined && 
                flight.airplane?.capacity !== undefined && 
                flight.airplane?.capacity < body.seat) {
                    throw new InvalidArgumentException(400, "Passenger seat is great than airplane's capacity");
            }
            booking = await bookingService.update(newData);
            res.send(booking);
        } catch(err: any) {
            next(new CustomError(err.code || 500, err.message));
        }
    }

    async deleteById(req: Request, res: Response, next: NextFunction) {
        try {
            InputValidator.validateIntRouteParamOrThrow(req.params.booking_id);
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
            InputValidator.validateIntRouteParamOrThrow(req.params.user_id);
            const id = parseInt(req.params.user_id);
            if (user.role === 'Passenger' && user.userId !== id) {
                throw new NotFoundException(404, 'Not found');
            }
            const filter: BookingFilter = JSON.parse(JSON.stringify(req.query));
            const page = isNaN(filter.page) ? 1 : filter.page;
            const size = isNaN(filter.per_page) ? 10 : filter.per_page;
            const bookings = await bookingService.retrieveUserBookingsByFilter(
                filter, 
                id,
                Paginator.getOffset(page, size), 
                size);
            const totalEntries: number = await bookingService.retrieveUserBookingsTotalEntries(filter, id);
            res.send({
                bookings: bookings,
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

export const bookingController = new BookingController();
