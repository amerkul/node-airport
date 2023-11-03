import { Router } from "express";
import { flightController } from "../controller/flight-controller";
import { authMiddleware } from "../middleware/auth-middleware";
import { setRoles } from "../middleware/authorization-middleware";

class FlightRouter {

    public router = Router();

    constructor() {
        this.initialize();
    }

    public initialize() {
        this.router.post('/api/v1/flights', authMiddleware, setRoles(['Admin']), flightController.create);
        this.router.delete('/api/v1/flights/:flight_id', authMiddleware, setRoles(['Admin']), flightController.deleteById);
        this.router.get('/api/v1/airplanes/:airplane_id/flights', flightController.getAirplaneFlights);
        this.router.get('/api/v1/flights/search', flightController.getFlightsFromStartPlaceToDestination);
        this.router.get('/api/v1/flights', flightController.getAll);
        this.router.get('/api/v1/flights/:flight_id', flightController.getById);
        this.router.put('/api/v1/flights/:flight_id', authMiddleware, setRoles(['Admin', 'Manager']), flightController.update);
    }

}

export const flightRouter = new FlightRouter();
