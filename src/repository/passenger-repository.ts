import CustomError from "../exception/custom-error";
import { pool } from "../connector/pg-pool";
import { PassengerFilter } from "../model/filter/passenger-filter";
import { Passenger } from "../model/passenger";

class PassengerRepository {

    async create(passenger: Passenger, userId: number | null): Promise<number> {
        try {
            const result = await pool.query(`
            INSERT INTO passengers (full_name,
            email, birthday, passport, user_id)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING passenger_id`, [
                passenger.fullName,
                passenger.email,
                passenger.birthday,
                passenger.passport,
                userId
            ]);
            return result.rows[0].passenger_id;
        } catch(e:any) {
            throw new CustomError(500, e.message);
        }
    }

    async findById(id: number): Promise<Passenger[]> {
        try {
            const result = await pool.query(`
            SELECT passenger_id, full_name,
            email, birthday::text, passport, user_id FROM passengers
            WHERE passenger_id = $1`, [id]);
            return result.rows.map(r => this.projectPassenger(r));
        } catch(e: any) {
            throw new CustomError(500, e.message);
        }
    }

    async delete(id: number): Promise<void> {
        try {
            await pool.query(`
            DELETE FROM passengers 
            WHERE passenger_id = $1`, [id]);
        } catch(e: any) {
            throw new CustomError(500, e.message);
        }
    }

    async update(newData: Passenger): Promise<void> {
        try {
            let query = `
            UPDATE passengers
            SET `;
            const params: string[] = [];
            if (newData.fullName !== undefined) {
                params.push(` full_name = '${newData.fullName}' `);
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
            if (params.length === 0) {
                return;
            }
            query += params.join(', ') + ` WHERE passenger_id = ${newData.id}`;
            await pool.query(query);
        } catch(e: any) {
            throw new CustomError(500, e.message);
        }
    }

    async search(filter: PassengerFilter, offset: number, size: number): Promise<Passenger[]> {
        try {
            let query = `
            SELECT passenger_id, full_name,
            email, birthday::text, passport FROM passengers `;
            const params: string[] = []; 
            if (filter.full_name !== undefined) {
                params.push(` full_name ILIKE '%${filter.full_name}%' `);
            } 
            if (filter.passport !== undefined) {
                params.push(` passport = '%${filter.passport}%' `);
            }
            if (filter.userId !== undefined) {
                params.push(` user_id = ${filter.userId} `);
            }
            if (params.length > 0) {
                query += `WHERE ${params.join('AND')} `;
            }
            query += `OFFSET ${offset} LIMIT ${size}`;
            const result = await pool.query(query);
            return result.rows.map(r => this.projectPassenger(r));
        } catch(e: any) {
            throw new CustomError(500, e.message);
        }
    }

    async findTotalEntries(filter: PassengerFilter): Promise<number> {
        try {
            let query = `
            SELECT COUNT(*) AS entries FROM passengers `;
            const params: string[] = []; 
            if (filter.full_name !== undefined) {
                params.push(` full_name ILIKE '%${filter.full_name}%' `);
            } 
            if (filter.passport !== undefined) {
                params.push(` passport = '%${filter.passport}%' `);
            }
            if (filter.userId !== undefined) {
                params.push(` user_id = ${filter.userId} `);
            }
            if (params.length > 0) {
                query += `WHERE ${params.join('AND')} `;
            }
            const result = await pool.query(query);
            return result.rows[0].entries;
        } catch(e: any) {
            throw new CustomError(500, e.message);
        }
    }

    public projectPassenger(r: any): Passenger {
        return ({
            id: r.passenger_id,
            fullName: r.full_name,
            email: r.email,
            birthday: r.birthday,
            passport: r.passport,
            userId: r.user_id
        });
    }

}

export const passengerRepository = new PassengerRepository();
