import CustomError from "../exception/custom-error";
import { Employee } from "../model/employee";
import { employeeRepository } from "../repository/employee-repository";
import NotFoundException from "../exception/not-found-exception";
import { EmployeeFilter } from "../model/filter/employee-filter";
import { Validator } from "./validator/service-validator";


class EmployeeService {

    private validator: Validator = new Validator();
    
    async create(employee: Employee): Promise<Employee> {
        try {
            this.validator.checkRequiredEmployeeParamsOrThrow(employee);
            const uniqueEmployees = await employeeRepository.findByUniqueParams(employee);
            this.validator.checkUniqueEmployeeParamsOrThrow(uniqueEmployees, employee);
            const id = await employeeRepository.create(employee);
            employee.user.id = id;
            return employee;
        } catch(err: any) {
            throw new CustomError(err.code || 500, err.message);
        }
    }

    async retrieveById(id: number): Promise<Employee> {
        try {
            const employee = (await employeeRepository.findById(id)).shift();
            if (employee === undefined) {
                throw new NotFoundException(400, `Employee with id = ${id} doesn't exist`);
            }
            return employee;
        } catch(err: any) {
            throw new CustomError(err.code || 500, err.message);
        }
    }

    async update(newData: Employee, id: number): Promise<Employee> {
        try {
            newData.user.id = id;
            const uniqueEmployees = await employeeRepository.findByUniqueParams(newData);
            this.validator.checkUniqueEmployeeParamsOrThrow(
                uniqueEmployees.filter(unique => unique.user.id !== id), newData
            );
            const user = uniqueEmployees.filter(unique => unique.user.id === id).shift();
            if (newData.user.firstName !== undefined && newData.user.lastName !== undefined) {
                newData.user.fullName = `${newData.user.firstName} ${newData.user.lastName}`;
            } else if (newData.user.firstName !== undefined && user !== undefined) {
                newData.user.fullName = `${newData.user.firstName} ${user.user.lastName}`;
            } else if (newData.user.lastName !== undefined && user !== undefined) {
                newData.user.fullName = `${user.user.firstName} ${newData.user.lastName}`;
            }
            await employeeRepository.update(newData);
            return this.retrieveById(id);
        } catch(err: any) {
            throw new CustomError(err.code || 500, err.message);
        }
    }

    async delete(id: number): Promise<void> {
        try {
            await employeeRepository.delete(id);
        } catch (err: any) {
            throw new CustomError(500, err);
        }
    }

    async retrieveTotalEntries(filter: EmployeeFilter): Promise<number> {
        try {
            return await employeeRepository.findTotalEntries(filter);
        } catch(err: any) {
            throw new CustomError(500, err.message);
        }
    }

    async retrieveByFilter(filter: EmployeeFilter, offset: number, size: number): Promise<Employee[]> {
        try {
            return await employeeRepository.search(filter, offset, size);
        } catch(err: any) {
            throw new CustomError(500, err.message);
        }
    }

}

export const employeeService = new EmployeeService();
