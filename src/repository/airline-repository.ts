import { pool } from "../connector/pg-pool";
import { Airline } from "../model/airline";
import { AirlineFilter } from "../model/filter/airline-filter";

class AirlineRepository {

    async create(airline: Airline, airportId: number): Promise<number>{
        const result = await pool.query(`
        INSERT INTO airlines (name, iata, base_airport_id)
        VALUES ($1, $2, $3) RETURNING airline_id`, [
            airline.name,
            airline.iata,
            airportId
        ]);
        return result.rows[0].airline_id;
    }

    async findById(id: number): Promise<Airline[]> {
        const result = await pool.query(`
        SELECT airline_id, name, iata, archive FROM airlines
        WHERE airline_id = $1`, [id]);
        return result.rows.map(r => this.projectAirline(r));
    }

    async delete(id: number): Promise<void> {
        await pool.query(`
        DELETE FROM airlines
        WHERE airline_id = $1`, [id]);
    }

    async update(newData: Airline): Promise<void> {
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
        query += params.join(', ') + ` WHERE airline_id = ${newData.id}`;
        await pool.query(query);
    }

    async search(filter: AirlineFilter, offset: number, size: number): Promise<Airline[]> {
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
