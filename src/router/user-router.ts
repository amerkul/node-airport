import { Router } from "express";
import { userController } from "../controller/user-controller";
import { passengerController } from "../controller/passenger-controller";

class UserRouter {

    public router = Router();

    constructor() {
        this.initialize();
    }

    public initialize() {
        this.router.post('/register', userController.register);
        this.router.post('/login', userController.login);
        this.router.get('/api/v1/passengers', passengerController.getAll);
        this.router.post('/api/v1/passengers', passengerController.create);
        this.router.delete('/api/v1/passengers/:passenger_id', passengerController.deleteById);
        this.router.get('/api/v1/passengers/:passenger_id', passengerController.getById);
        this.router.get('/api/v1/flights/:flight_id/passengers', passengerController.getFlightPassengers);
        this.router.put('/api/v1/passengers/:passenger_id', passengerController.update);
    }

}

export const userRouter = new UserRouter();

