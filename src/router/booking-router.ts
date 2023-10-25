import { Router } from "express";
import { bookingController } from "../controller/booking-controller";

class BookingRouter {

    public router = Router();

    constructor() {
        this.initialize();
    }

    public initialize() {
        this.router.post('/api/v1/flights/:flight_id/bookings', bookingController.create);
        this.router.delete('/api/v1/bookings/:booking_id', bookingController.deleteById);
        this.router.get('/api/v1/bookings', bookingController.getAll);
        this.router.get('/api/v1/bookings/:booking_id', bookingController.getById);
        this.router.get('/api/v1/passengers/:passenger_id/bookings', bookingController.getPassengerBookings);
        this.router.put('/api/v1/bookings/:booking_id', bookingController.update);
    }

}

export const userRouter = new BookingRouter();
