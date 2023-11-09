import { pool } from "../connector/pg-pool";
import { Employee } from "../model/employee";
import User from "../model/user";
import { userRepository } from "./user-repository";
import { EmployeeFilter } from "../model/filter/employee-filter";
import CustomError from "../exception/custom-error";

class EmployeeRepository {

    async create(employee: Employee): Promise<number> {
        try {
            const userId = (await userRepository.create(employee.user));
            await pool.query(`
            INSERT INTO employees (department, salary, user_id)
            VALUES ($1, $2, $3)`, [
                employee.department,
                employee.salary,
                userId
            ]);
            return userId;
        } catch(e: any) {
            throw new CustomError(500, e.message);
        } 
    }

    async findById(id: number): Promise<Employee[]> {
        try {
            const result = await pool.query(`
            SELECT users.user_id, active, role, username, 
            first_name, last_name, full_name, email, 
            birthday::text, passport, phone, sex, country,
            city, zip, street, department, salary FROM users
            JOIN employees ON users.user_id = employees.user_id
            WHERE users.user_id = $1`, [id]);
            return result.rows.map(r => {
                return this.projectEmployee(r, userRepository.projectUser(r));
            });
        } catch(e: any) {
            throw new CustomError(500, e.message);
        }  
    }

    async delete(id: number): Promise<void> {
        try {
            await pool.query(`
            DELETE FROM users
            WHERE user_id = $1`, [id]);
        } catch(e: any) {
            throw new CustomError(500, e.message);
        }
    }

    async update(newData: Employee): Promise<void> {
        try {
            await userRepository.update(newData.user);
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
            if (params.length === 0) {
                return;
            }
            query += params.join(', ') + ` WHERE user_id = ${newData.user.id}`;
            await pool.query(query);
        } catch(e: any) {
            throw new CustomError(500, e.message);
        }
    }

    async search(filter: EmployeeFilter, offset: number, size: number): Promise<Employee[]> {
        try {
            let query = `
            SELECT users.user_id, active, role, username,
            first_name, last_name, full_name, email, 
            birthday::text, passport, phone, sex, country,
            city, zip, street, department, salary FROM users
            JOIN employees ON users.user_id = employees.user_id `;
            const params: string[] = [];
            if (filter.full_name !== undefined) {
                params.push(` users.full_name ILIKE '%${filter.full_name}%' `);
            } 
            if (filter.active !== undefined) {
                params.push(` users.active = ${filter.active} `);
            }
            if (filter.passport !== undefined) {
                params.push(` users.passport ILIKE '%${filter.passport}%' `);
            }
            if (filter.department !== undefined) {
                params.push(` employees.department ILIKE '%${filter.department}%' `);
            }
            if (params.length > 0) {
                query += `WHERE ${params.join('AND')}`
            }
            query += `OFFSET ${offset} LIMIT ${size}`;
            const result = await pool.query(query);
            return result.rows.map(r => this.projectEmployee(r, userRepository.projectUser(r)));
        } catch(e: any) {
            throw new CustomError(500, e.message);
        }
    }

    async findTotalEntries(filter: EmployeeFilter): Promise<number> {
        try {
            let query = `
            SELECT COUNT(*) AS entries FROM users
            JOIN employees ON users.user_id = employees.user_id `;
            const params: string[] = [];
            if (filter.full_name !== undefined) {
                params.push(` users.full_name ILIKE '%${filter.full_name}%' `);
            } 
            if (filter.active !== undefined) {
                params.push(` users.active = ${filter.active} `);
            }
            if (filter.passport !== undefined) {
                params.push(` users.passport ILIKE '%${filter.passport}%' `);
            }
            if (filter.department !== undefined) {
                params.push(` employees.department ILIKE '%${filter.department}%' `);
            }
            if (params.length > 0) {
                query += `WHERE ${params.join('AND')}`
            }
            const result = await pool.query(query);
            return result.rows[0].entries;
        } catch(e: any) {
            throw new CustomError(500, e.message);
        }
    }

    async findByUniqueParams(employee: Employee): Promise<Employee[]> {
        try {
            let query = `
            SELECT users.user_id, active, role, username,
            first_name, last_name, full_name, email, 
            birthday::text, passport, phone, sex, country,
            city, zip, street, department, salary FROM users
            LEFT JOIN employees ON users.user_id = employees.user_id `;
            const params: string[] = [];
            if (employee.user.username !== undefined) {
                params.push(` users.username = '${employee.user.username}' `);
            } 
            if (employee.user.email !== undefined) {
                params.push(` users.email = '${employee.user.email}' `);
            }
            if (employee.user.passport !== undefined) {
                params.push(` users.passport = '${employee.user.passport}' `);
            }
            if (employee.user.id !== undefined) {
                params.push(` users.user_id = ${employee.user.id} `);
            }
            if (params.length === 0) {
                return [];
            }
            query += `WHERE ${params.join('OR')}`
            const result = await pool.query(query);
            return result.rows.map(r => this.projectEmployee(r, userRepository.projectUser(r)));
        } catch(e: any) {
            throw new CustomError(500, e.message);
        }
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
