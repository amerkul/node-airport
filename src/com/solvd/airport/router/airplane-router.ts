import { Router } from "express";
import { airplaneController } from "../controller/airplane-controller";

class AirplaneRouter {
    public router = Router();

    constructor() {
        this.initialize();
    }

    initialize() {
        this.router.get('/api/v1/airplanes', airplaneController.getAll);
        this.router.get('/api/v1/airplanes/:airplane_id', airplaneController.getById);
        this.router.post('/api/v1/airplanes', airplaneController.create);
        this.router.put('/api/v1/airplanes/:airplane_id', airplaneController.update);
        this.router.get('/api/v1/airlines/:airline_id/airplanes', airplaneController.getAirlineAirplanes);
        this.router.delete('/api/v1/airplanes/:airplane_id', airplaneController.deleteById);
    }

}

export const airlineRouter = new AirplaneRouter();
