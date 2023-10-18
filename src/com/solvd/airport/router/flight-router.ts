import { Router } from "express";
import { flightController } from "../controller/flight-controller";

class FlightRouter {

    public router = Router();

    constructor() {
        this.initialize();
    }

    public initialize() {
        this.router.post('/api/v1/flights', flightController.create);
        this.router.delete('/login', flightController.deleteById);
        this.router.get('/api/v1/airplanes/{airplane_id}/flights', flightController.getAirplaneFlights);
        this.router.get('/api/v1/flights', flightController.getAll);
        this.router.get('/api/v1/flights/:flight_id', flightController.getById);
        this.router.put('/api/v1/flights/:flight_id', flightController.update);
    }

}

export const userRouter = new FlightRouter();
