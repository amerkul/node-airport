import { Router } from "express";
import { airportController } from "../controller/airport-controller";
import { authMiddleware } from "../middleware/auth-middleware";
import { setRoles } from "../middleware/authorization-middleware";


class AirportRouter {
    public router = Router();

    constructor() {
        this.initialize();
    }

    initialize() {
        this.router.get('/api/v1/airports', airportController.getAllByFilter);
        this.router.get('/api/v1/airports/:airport_id', airportController.getById);
        this.router.post('/api/v1/airports', authMiddleware, setRoles(['Admin']), airportController.create);
        this.router.put('/api/v1/airports/:airport_id', authMiddleware, setRoles(['Admin', 'Manager']), airportController.update);
        this.router.delete('/api/v1/airports/:airport_id', authMiddleware, setRoles(['Admin']), airportController.deleteById);
    }

}

export const airportRouter = new AirportRouter();
