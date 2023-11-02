import { NextFunction, Request, Response } from "express";
import { EmployeeFilter } from "../model/filter/employee-filter";
import CustomError from "../exception/custom-error";
import { employeeService } from "../service/employee-service";
import { Employee } from "../model/employee";
import { CreateEmployeeDto } from "../dto/create-employee-dto";
import { UpdateEmployeeDto } from "../dto/update-employee-dto";
import User from "../model/user";


class EmployeeController {
    
    async getAll(req: Request, res: Response, next: NextFunction) {
        try {
            const filter: EmployeeFilter = JSON.parse(JSON.stringify(req.query));
            res.send(await employeeService.retrieveByFilter(filter, ((filter.page - 1) * filter.per_page) || 0, filter.per_page || 10));
        } catch(err: any) {
            next(new CustomError(err.code || 500, err.message));
        }
    }

    async getById(req: Request, res: Response, next: NextFunction) {
        try {
            const id = parseInt(req.params.employee_id);
            res.send(await employeeService.retrieveById(id));
        } catch(err: any) {
            next(new CustomError(err.code || 500, err.message));
        }
    }

    async create(req: Request, res: Response, next: NextFunction) {
        try {
            const body: CreateEmployeeDto = req.body;
            const user: User = {...body};
            const {department, salary} = {...body};
            const employee: Employee = new Employee();
            employee.department = department;
            employee.user = user;
            employee.salary = salary;
            res.status(201).send(await employeeService.create(employee));
        } catch(err: any) {
            next(new CustomError(err.code || 500, err.message));
        }
    }

    async update(req: Request, res: Response, next: NextFunction) {
        try {
            const body: UpdateEmployeeDto = req.body;
            const id = parseInt(req.params.employee_id);
            const user: User = {...body};
            const {department, salary} = {...body};
            const newData: Employee = new Employee();
            newData.department = department;
            newData.user = user;
            newData.salary = salary;
            res.send(await employeeService.update(newData, id));
        } catch(err: any) {
            next(new CustomError(err.code || 500, err.message));
        }
    }

    async deleteById(req: Request, res: Response, next: NextFunction) {
        try {
            const id = parseInt(req.params.employee_id);
            await employeeService.delete(id);
            res.sendStatus(204);
        } catch(err: any) {
            next(new CustomError(err.code || 500, err.message));
        }
    }
}

export const employeeController = new EmployeeController();
