import CustomError from "../exception/custom-error";
import { pool } from "../connector/pg-pool";
import { Airline } from "../model/airline";
import { AirlineFilter } from "../model/filter/airline-filter";

class AirlineRepository {

    async create(airline: Airline, airportId: number): Promise<number>{
        try {
            const result = await pool.query(`
            INSERT INTO airlines (name, iata, base_airport_id)
            VALUES ($1, $2, $3) RETURNING airline_id`, [
                airline.name,
                airline.iata,
                airportId
            ]);
            return result.rows[0].airline_id;
        } catch(e: any) {
            throw new CustomError(500, e.message);
        }
    }

    async findById(id: number): Promise<Airline[]> {
        try {
            const result = await pool.query(`
            SELECT airline_id, name, iata, archive FROM airlines
            WHERE airline_id = $1`, [id]);
            return result.rows.map(r => this.projectAirline(r));
        } catch(e: any) {
            throw new CustomError(500, e.message);
        }
    }

    async delete(id: number): Promise<void> {
        try {
            await pool.query(`
            DELETE FROM airlines
            WHERE airline_id = $1`, [id]);
        } catch(e: any) {
            throw new CustomError(500, e.message);
        }
    }

    async update(newData: Airline): Promise<void> {
        try {
            let query = `
            UPDATE airlines
            SET `;
            const params: string[] = [];
            if (newData.name !== undefined) {
                params.push(`name = '${newData.name}'`);
            } 
            if (newData.archive !== undefined) {
                params.push(`archive = ${newData.archive}`);
            }
            if (newData.iata !== undefined) {
                params.push(`iata = '${newData.iata}'`);
            }
            if (params.length === 0) {
                return;
            }
            query += params.join(', ') + ` WHERE airline_id = ${newData.id}`;
            await pool.query(query);
        } catch(e: any) {
            throw new CustomError(500, e.message);
        }
    }

    async findByUniqueParams(airline: Airline): Promise<Airline[]> {
        try {
            let query = `
            SELECT airline_id, name, iata, archive FROM airlines `;
            const params: string[] = [];
            if (airline.name !== undefined) {
                params.push(` name = '${airline.name}' `);
            }
            if (airline.iata !== undefined) {
                params.push(` iata = '${airline.iata}' `);
            }
            if (params.length === 0) {
                return [];
            }
            query += `WHERE ${params.join('OR')} `;
            const result = await pool.query(query);
            return result.rows.map(r => this.projectAirline(r));
        } catch(e: any) {
            throw new CustomError(500, e.message);
        }
    }

    async search(filter: AirlineFilter, offset: number, size: number): Promise<Airline[]> {
        try {
            let query = `
            SELECT airline_id, name, iata, archive FROM airlines `;
            const params: string[] = [];
            if (filter.ids) {
                params.push(` airline_id in (${filter.ids.join(', ')}) `);
            } 
            if (filter.archive !== undefined) {
                params.push(` archive = ${filter.archive} `);
            }
            if (filter.name !== undefined) {
                params.push(` name ILIKE '%${filter.name}%' `);
            }
            if (filter.airportId !== undefined) {
                params.push(` base_airport_id = ${filter.airportId} `);
            }
            if (params.length > 0) {
                query += `WHERE ${params.join('AND')} `;
            }
            query += `OFFSET ${offset} LIMIT ${size}`;
            const result = await pool.query(query);
            return result.rows.map(r => this.projectAirline(r));
        } catch(e: any) {
            throw new CustomError(500, e.message);
        }
    }

    async findTotalEntries(filter: AirlineFilter): Promise<number> {
        try {
            let query = `
            SELECT COUNT(*) as entries FROM airlines `;
            const params: string[] = [];
            if (filter.ids) {
                params.push(` airline_id in (${filter.ids.join(', ')}) `);
            } 
            if (filter.archive !== undefined) {
                params.push(` archive = ${filter.archive} `);
            }
            if (filter.name !== undefined) {
                params.push(` name ILIKE '%${filter.name}%' `);
            }
            if (filter.airportId !== undefined) {
                params.push(` base_airport_id = ${filter.airportId} `);
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

    public projectAirline(r: any): Airline {
        return ({
            id: r.airline_id,
            name: r.name,
            iata: r.iata,
            archive: r.archive
        });
    }

}

export const airlineRepository = new AirlineRepository();
