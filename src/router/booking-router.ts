import { Router } from "express";
import { bookingController } from "../controller/booking-controller";
import { authMiddleware } from "../middleware/auth-middleware";
import { setRoles } from "../middleware/authorization-middleware";

class BookingRouter {

    public router = Router();

    constructor() {
        this.initialize();
    }

    public initialize() {
        this.router.post('/api/v1/flights/:flight_id/bookings', authMiddleware, setRoles(['Admin', 'Manager', 'Passenger']), bookingController.create);
        this.router.delete('/api/v1/bookings/:booking_id', authMiddleware, setRoles(['Admin', 'Manager']), bookingController.deleteById);
        this.router.get('/api/v1/bookings', authMiddleware, setRoles(['Admin', 'Manager']), bookingController.getAll);
        this.router.get('/api/v1/bookings/:booking_id', setRoles(['Admin', 'Manager']), bookingController.getById);
        this.router.get('/api/v1/users/:user_id/bookings', authMiddleware, setRoles(['Admin', 'Manager', 'Passenger']), bookingController.getUserBookings);
        this.router.put('/api/v1/users/:user_id/bookings/:booking_id', authMiddleware, setRoles(['Admin', 'Manager', 'Passenger']), bookingController.update);
        this.router.get('/api/v1/flights/:flight_id/bookings/:booking_id', authMiddleware, setRoles(['Admin', 'Manager']), bookingController.update);
    }

}

export const bookingRouter = new BookingRouter();
