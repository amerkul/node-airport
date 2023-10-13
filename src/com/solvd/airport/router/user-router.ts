import { Router } from "express";
import UserController, { userController } from "../controller/user-controller";

export default class UserRouter {

    private userController: UserController;
    private router = Router();

    constructor(userController: UserController) {
        this.userController = userController;
        this.initialize();
    }

    public initialize() {
        this.router.post('/register', this.userController.register);
        this.router.post('/login', this.userController.login);
    }

}

export const userRouter = new UserRouter(userController);

