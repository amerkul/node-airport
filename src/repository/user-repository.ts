import { pool } from '../connector/pg-pool';
import { UserFilter } from '../model/filter/user-filter';
import User from '../model/user';

class UserRepository {

    async create(user: User): Promise<number> {
        const result = await pool.query(`
        INSERT INTO users (role, username, password, 
        first_name, last_name, full_name, email, 
        birthday, passport, phone, sex, country,
        city, zip, street)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 
        $9, $10, $11, $12, $13, $14, $15) RETURNING user_id`, [
            user.role, user.username, user.passport,
            user.firstName, user.lastName, user.fullName,
            user.email, user.birthday || null, user.passport,
            user.phone || null, user.sex || null, 
            user.country || null, user.city || null,
            user.zip || null, user.street || null
        ]);
        return result.rows[0].user_id;
    }

    async findById(id: number): Promise<User[]> {
        const result = await pool.query(`
        SELECT user_id, active, role, username, password, 
        first_name, last_name, full_name, email, 
        birthday::text, passport, phone, sex, country,
        city, zip, street FROM users
        WHERE user_id = $1`, [id]);
        return result.rows.map(r => this.projectUser(r));
    }

    async delete(id: number): Promise<void> {
        await pool.query(`
        DELETE FROM users
        WHERE user_id = $1`, [id]);
    }

    async update(newData: User): Promise<void> {
        let query = `
        UPDATE users
        SET `;
        const params: string[] = [];
        if (newData.role !== undefined) {
            params.push(` role = '${newData.role}' `);
        } 
        if (newData.active !== undefined) {
            params.push(` active = ${newData.active} `);
        }
        if (newData.username !== undefined) {
            params.push(` username = '${newData.username}' `);
        }
        if (newData.password !== undefined) {
            params.push(` password = '${newData.password}' `);
        }
        if (newData.firstName !== undefined) {
            params.push(` first_name = '${newData.firstName}' `);
        }
        if (newData.lastName !== undefined) {
            params.push(` last_name = '${newData.lastName}' `);
        }
        if (newData.email !== undefined) {
            params.push(` email = '${newData.email}' `);
        }
        if (newData.birthday !== undefined) {
            params.push(` birthday = '${newData.birthday}' `);
        }
        if (newData.passport !== undefined) {
            params.push(` passport = '${newData.passport}' `);
        }
        if (newData.fullName !== undefined) {
            params.push(` full_name = '${newData.fullName}' `);
        }
        if (newData.phone !== undefined) {
            params.push(` phone = '${newData.phone}' `);
        }
        if (newData.sex !== undefined) {
            params.push(` sex = '${newData.sex}' `);
        }
        if (newData.country !== undefined) {
            params.push(` country = '${newData.country}' `);
        }
        if (newData.city !== undefined) {
            params.push(` city = '${newData.city}' `);
        }
        if (newData.zip !== undefined) {
            params.push(` zip = ${newData.zip} `);
        }
        if (newData.street !== undefined) {
            params.push(` street = '${newData.street}' `);
        }
        query += params.join(', ') + ` WHERE user_id = ${newData.id}`;
        await pool.query(query);
    }

    async search(filter: UserFilter, offset: number, size: number): Promise<User[]> {
        let query = `
        SELECT user_id, active, role, username, password, 
        first_name, last_name, full_name, email, 
        birthday::text, passport, phone, sex, country,
        city, zip, street FROM users `;
        const params: string[] = [];
        if (filter.fullName !== undefined) {
            params.push(` full_name ILIKE '%${filter.fullName}%' `);
        } 
        if (filter.active !== undefined) {
            params.push(` active = ${filter.active} `);
        }
        if (filter.passport !== undefined) {
            params.push(` passport ILIKE '%${filter.passport}%' `);
        }
        if (params.length > 0) {
            query += `WHERE ${params.join('AND')}`;
        }
        query += `OFFSET ${offset} LIMIT ${size}`;
        const result = await pool.query(query);
        return result.rows.map(r => this.projectUser(r));
    }

    public projectUser(r: any): User {
        return ({
            id: r.user_id,
            role: r.role,
            username: r.username,
            password: r.password,
            firstName: r.first_name,
            lastName: r.last_name,
            email: r.email,
            birthday: r.birthday,
            passport: r.passport,
            fullName: r.full_name,
            active: r.active,
            phone: r.phone,
            sex: r.sex,
            country: r.country,
            city: r.city,
            zip: r.zip,
            street: r.street
        });
    }

}

export const userRepository = new UserRepository();
