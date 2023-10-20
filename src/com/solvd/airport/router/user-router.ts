import { Router } from "express";
import { userController } from "../controller/user-controller";

class UserRouter {

    public router = Router();

    constructor() {
        this.initialize();
    }

    public initialize() {
        this.router.post('/register', userController.register);
        this.router.post('/login', userController.login);
    }

}

export const userRouter = new UserRouter();

