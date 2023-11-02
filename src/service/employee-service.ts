import CustomError from "../exception/custom-error";
import { Employee } from "../model/employee";
import { employeeRepository } from "../repository/employee-repository";
import NotFoundException from "../exception/not-found-exception";
import { EmployeeFilter } from "../model/filter/employee-filter";


class EmployeeService {

    async create(employee: Employee): Promise<Employee> {
        try {
            const id = await employeeRepository.create(employee);
            employee.user.id = id;
            return employee;
        } catch(err: any) {
            throw new CustomError(500, err.message);
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

    async retrieveAll(offset: number, size: number): Promise<Employee[]> {
        try {
            return await employeeRepository.search(new EmployeeFilter(), offset, size);
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
