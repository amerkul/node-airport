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
    }

}

export const airlineRouter = new AirlineRouter();