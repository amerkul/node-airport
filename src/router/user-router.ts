import { Router } from "express";
import { userController } from "../controller/user-controller";
import { passengerController } from "../controller/passenger-controller";
import { employeeController } from "../controller/employee-controller";
import { authMiddleware } from "../middleware/auth-middleware";
import { setRoles } from "../middleware/authorization-middleware";

class UserRouter {

    public router = Router();

    constructor() {
        this.initialize();
    }

    public initialize() {
        this.router.post('/register', userController.register);
        this.router.post('/login', userController.login);

        this.router.get('/api/v1/passengers', authMiddleware, setRoles(['Admin', 'Manager']), passengerController.getAll);
        this.router.post('/api/v1/passengers', authMiddleware, passengerController.create);
        this.router.delete('/api/v1/passengers/:passenger_id', authMiddleware, setRoles(['Admin']), passengerController.deleteById);
        this.router.get('/api/v1/passengers/:passenger_id', authMiddleware, setRoles(['Admin', 'Manager']), passengerController.getById);
        this.router.put('/api/v1/passengers/:passenger_id', authMiddleware, setRoles(['Admin', 'Manager']), passengerController.update);

        this.router.get('/api/v1/users', authMiddleware, setRoles(['Admin', 'Manager']), userController.getAll);
        this.router.post('/api/v1/users', authMiddleware, setRoles(['Admin']), userController.create);
        this.router.delete('/api/v1/users/:user_id', authMiddleware, setRoles(['Admin']), userController.deleteById);
        this.router.get('/api/v1/users/:user_id', authMiddleware, setRoles(['Admin', 'Manager', 'Passenger']), userController.getById);
        this.router.put('/api/v1/users/:user_id', authMiddleware, setRoles(['Admin', 'Manager', 'Passenger']), userController.update);

        this.router.get('/api/v1/employee', authMiddleware, setRoles(['Admin', 'Manager']), employeeController.getAll);
        this.router.post('/api/v1/employees', authMiddleware, setRoles(['Admin']), employeeController.create);
        this.router.delete('/api/v1/employees/:employee_id', authMiddleware, setRoles(['Admin']), employeeController.deleteById);
        this.router.get('/api/v1/employees/:employee_id', authMiddleware, setRoles(['Admin', 'Manager']), employeeController.getById);
        this.router.put('/api/v1/employees/:employee_id', authMiddleware, setRoles(['Admin', 'Manager']), employeeController.update);
    }

}

export const userRouter = new UserRouter();

