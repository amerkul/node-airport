import { Router } from "express";
import { airportController } from "../controller/airport-controller";

class AirportRouter {
    public router = Router();

    constructor() {
        this.initialize();
    }

    initialize() {
        this.router.get('/api/v1/airports', airportController.getAll);
        this.router.get('/api/v1/airports/:airport_id', airportController.getById);
        this.router.post('/api/v1/airports', airportController.create);
        this.router.put('/api/v1/airports/:airport_id', airportController.update);
        this.router.delete('/api/v1/airports/:airport_id', airportController.deleteById);
    }

}

export const airportRouter = new AirportRouter();
