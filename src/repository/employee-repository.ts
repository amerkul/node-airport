import { pool } from "../connector/pg-pool";
import { Employee } from "../model/employee";
import User from "../model/user";
import { userRepository } from "./user-repository";
import { EmployeeFilter } from "../model/filter/employee-filter";

class EmployeeRepository {

    async create(employee: Employee): Promise<number> {
        const userId = (await userRepository.create(employee.user));
        await pool.query(`
        INSERT INTO employees (department, salary, user_id)
        VALUES ($1, $2, $3)`, [
            employee.department,
            employee.salary,
            userId
        ]);
        return userId;
    }

    async findById(id: number): Promise<Employee[]> {
        const result = await pool.query(`
        SELECT users.user_id, active, role, username, password, 
        first_name, last_name, full_name, email, 
        birthday::text, passport, phone, sex, country,
        city, zip, street, department, salary FROM users
        JOIN employees ON users.user_id = employees.user_id
        WHERE users.user_id = $1`, [id]);
        return result.rows.map(r => {
            return this.projectEmployee(r, userRepository.projectUser(r));
        });
    }

    async delete(id: number): Promise<void> {
        await pool.query(`
        DELETE FROM users
        WHERE user_id = $1`, [id]);
    }

    async update(newData: Employee): Promise<void> {
        const updated = (await userRepository.update(newData.user));
        let query = `
        UPDATE employees
        SET `;
        const params: string[] = [];
        if (newData.department !== undefined) {
            params.push(` department = '${newData.department}' `);
        } 
        if (newData.salary !== undefined) {
            params.push(` salary = ${newData.salary} `);
        }
        query += params.join(', ') + ` WHERE user_id = ${newData.user.id}`;
        await pool.query(query);
    }

    async search(filter: EmployeeFilter, offset: number, size: number): Promise<Employee[]> {
        let query = `
        SELECT users.user_id, active, role, username, password, 
        first_name, last_name, full_name, email, 
        birthday::text, passport, phone, sex, country,
        city, zip, street, department, salary FROM users
        JOIN employees ON users.user_id = employees.user_id `;
        const params: string[] = [];
        if (filter.fullName !== undefined) {
            params.push(` users.full_name ILIKE '%${filter.fullName}%' `);
        } 
        if (filter.active !== undefined) {
            params.push(` users.active = ${filter.active} `);
        }
        if (filter.passport !== undefined) {
            params.push(` users.passport ILIKE '%${filter.passport}%' `);
        }
        if (filter.department !== undefined) {
            params.push(` employees.department = '%${filter.department}%' `);
        }
        if (params.length > 0) {
            query += `WHERE ${params.join('AND')}`
        }
        query += `OFFSET ${offset} LIMIT ${size}`;
        const result = await pool.query(query);
        return result.rows.map(r => this.projectEmployee(r, userRepository.projectUser(r)));
    }

    public projectEmployee(r: any, user: User): Employee {
        return ({
            user: user,
            department: r.department,
            salary: parseFloat(r.salary)
        });
    }

}

export const employeeRepository = new EmployeeRepository();
