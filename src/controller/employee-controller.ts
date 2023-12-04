import { NextFunction, Request, Response } from "express";
import { EmployeeFilter } from "../model/filter/employee-filter";
import CustomError from "../exception/custom-error";
import { employeeService } from "../service/employee-service";
import { Employee } from "../model/employee";
import { CreateEmployeeDto } from "../dto/create-employee-dto";
import { UpdateEmployeeDto } from "../dto/update-employee-dto";
import User from "../model/user";
import { Paginator } from "./util/paginator";
import { InputValidator } from "./validator/input-validator";


class EmployeeController {
    
    async getAll(req: Request, res: Response, next: NextFunction) {
        try {
            const filter: EmployeeFilter = JSON.parse(JSON.stringify(req.query));
            InputValidator.validateEmployeeInputOrThrow(filter);
            const page = isNaN(filter.page) ? 1 : filter.page;
            const size = isNaN(filter.per_page) ? 10 : filter.per_page;
            const employees = await employeeService.retrieveByFilter(
                filter, 
                Paginator.getOffset(page, size), 
                size);
            const totalEntries: number = await employeeService.retrieveTotalEntries(filter);
            res.send({
                employees: employees,
                page: page,
                per_page: size,
                total_entries: totalEntries as number || 0,
                total_pages: Paginator.getTotalPages(totalEntries, size)
            });
        } catch(err: any) {
            next(new CustomError(err.code || 500, err.message));
        }
    }

    async getById(req: Request, res: Response, next: NextFunction) {
        try {
            InputValidator.validateIntRouteParamOrThrow(req.params.employee_id);
            const id = parseInt(req.params.employee_id);
            res.send(await employeeService.retrieveById(id));
        } catch(err: any) {
            next(new CustomError(err.code || 500, err.message));
        }
    }

    async create(req: Request, res: Response, next: NextFunction) {
        try {
            const body: CreateEmployeeDto = req.body;
            InputValidator.validateEmployeeInputOrThrow(body);
            const user: User = {...body};
            user.fullName = `${user.firstName} ${user.lastName}`;
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
            InputValidator.validateIntRouteParamOrThrow(req.params.employee_id);
            const id = parseInt(req.params.employee_id);
            const body: UpdateEmployeeDto = req.body;
            InputValidator.validateEmployeeInputOrThrow(body);
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
            InputValidator.validateIntRouteParamOrThrow(req.params.employee_id);
            const id = parseInt(req.params.employee_id);
            await employeeService.delete(id);
            res.sendStatus(204);
        } catch(err: any) {
            next(new CustomError(err.code || 500, err.message));
        }
    }
}

export const employeeController = new EmployeeController();
