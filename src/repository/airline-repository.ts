import { pool } from "../connector/pg-pool";
import { Airline } from "../model/airline";
import { AirlineFilter } from "../model/filter/airline-filter";

class AirlineRepository {

    async create(airline: Airline, airportId: number): Promise<Airline[]>{
        const result = await pool.query(`
        INSERT INTO airlines (name, iata, base_airport_id)
        VALUES ($1, $2, $3)`, [
            airline.name,
            airline.iata,
            airportId
        ]);
        return result.rows.map(r => this.projectAirline(r));
    }

    async findById(id: number): Promise<Airline[]> {
        const result = await pool.query(`
        SELECT airline_id, name, iata, archive FROM airlines
        WHERE id = $1`, [id]);
        return result.rows.map(r => this.projectAirline(r));
    }

    async delete(id: number): Promise<void> {
        await pool.query(`
        DELETE FROM airlines
        WHERE airline_id = $1`, [id]);
    }

    async update(newData: Airline, id: number): Promise<Airline[]> {
        let query = `UPDATE airlines SET `
        for (let key in newData) {
            let i = 0;
            if (newData[key] !== undefined) {
                query += `${key}=$${++i}, `
            } 
        }
        query = query.substring(0, query.length - 2) + ` WHERE airline_id = ${id}`;
        const result = await pool.query(query);
        return result.rows.map(r => this.projectAirline(r));
    }

    async search(filter: AirlineFilter, offset: number, size: number): Promise<Airline[]> {
        let query = `
        SELECT airline_id, name, iata, archive
        WHERE `;
        if (filter.ids) {
            query += `airline_id in (${filter.ids.join(', ')}) `;
        } 
        if (filter.archive !== undefined) {
            query += `&& archive = ${filter.archive} `;
        }
        if (filter.name !== undefined) {
            query += `&& name = ${filter.name} `;
        }
        if (filter.airportId !== undefined) {
            query += `&& airport_id = ${filter.airportId} `;
        }
        query += `OFFSET ${offset} LIMIT ${size}`;
        const result = await pool.query(query);
        return result.rows.map(r => this.projectAirline(r));
    }

    private projectAirline(r: any): Airline {
        return ({
            id: r.airline_id,
            name: r.name,
            iata: r.iata,
            archive: r.archive
        });
    }

}

export const airlineRepository = new AirlineRepository();
