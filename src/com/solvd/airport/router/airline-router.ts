import { Router } from "express";
import { airlineController } from "../controller/airline-controller";

class AirlineRouter {
    public router = Router();

    constructor() {
        this.initialize();
    }

    initialize() {
        this.router.get('/api/v1/airlines', airlineController.getAll);
        this.router.get('/api/v1/airlines/:airline_id', airlineController.getById);
        this.router.post('/api/v1/airlines', airlineController.create);
        this.router.put('/api/v1/airlines/:airline_id', airlineController.update);
        this.router.get('/api/v1/airports/:airport_id/airlines', airlineController.getAirportAirlines);
        this.router.delete('/api/v1/airlines/:airline_id', airlineController.deleteById);
    }

}

export const airlineRouter = new AirlineRouter();
