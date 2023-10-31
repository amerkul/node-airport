import { pool } from '../connector/pg-pool';
import { Airport } from '../model/airport';
import { AirportFilter } from '../model/filter/airport-filter';

class AirportRepository {

    async createAirport(airport: Airport): Promise<number> {
        const result = await pool.query(
            `INSERT INTO airports (name, iata, icao, country, city, latitude, longitude)
             VALUES ($1, $2, $3, $4, $5, $6, $7)
             RETURNING airport_id`, [
                airport.name,
                airport.iata,
                airport.icao,
                airport.country,
                airport.city,
                airport.latitude || null,
                airport.longitude || null,
        ]);
        return result.rows[0].airport_id;
    }

    async findById(id: number): Promise<Airport[]> {
        const result = await pool.query(
            `SELECT airport_id, name, iata, icao, country, city, latitude, longitude, archive
             FROM airports 
             WHERE airport_id = $1`, [id]
        ) ;
        return result.rows.map(r => this.projectAirport(r));
    }

    async update(newData: Airport): Promise<void> {
        let query = `
        UPDATE airports
        SET `;
        const params: string[] = [];
        if (newData.name !== undefined) {
            params.push(`name = '${newData.name}'`);
        } 
        if (newData.archive !== undefined) {
            params.push(`archive = ${newData.archive}`);
        }
        if (newData.country !== undefined) {
            params.push(`country = '${newData.country}'`);
        }
        if (newData.city !== undefined) {
            params.push(`city = '${newData.city}'`);
        }
        if (newData.iata !== undefined) {
            params.push(`iata = '${newData.iata}'`);
        }
        if (newData.icao !== undefined) {
            params.push(`icao = '${newData.icao}'`);
        }
        if (newData.longitude !== undefined) {
            params.push(`longitude = ${newData.longitude}`);
        }
        if (newData.latitude !== undefined) {
            params.push(`latitude = ${newData.latitude}`);
        }
        query += params.join(', ') + ` WHERE airport_id = ${newData.id}`;
        await pool.query(query);
    }

    async delete(id: number): Promise<void> {
        pool.query(`DELETE FROM airports WHERE airport_id = ${id}`);
    }

    async search(filter: AirportFilter, offset: number, size: number) {
        let query = `
        SELECT airport_id, name, archive, country, city, latitude, 
        longitude, iata, icao FROM airports `;
        const params: string[] = [];
        if (filter.ids) {
            params.push(` airport_id in (${filter.ids.join(', ')}) `);
        } 
        if (filter.archive !== undefined) {
            params.push(` archive = ${filter.archive} `);
        }
        if (filter.name !== undefined) {
            params.push(` name ILIKE '%${filter.name}%'`);
        }
        if (filter.country !== undefined) {
            params.push(` country ILIKE '%${filter.country}%' `);
        }
        if (filter.city !== undefined) {
            params.push(` city ILIKE '%${filter.city}%' `);
        }
        if (params.length > 0) {
            query += `WHERE ${params.join('AND')} `
        }
        query += `OFFSET ${offset} LIMIT ${size}`;
        const result = await pool.query(query);
        return result.rows.map(r => this.projectAirport(r));
    }

    public projectAirport(r: any): Airport {
        return ({
            id: r.airport_id,
            name: r.name,
            iata: r.iata,
            icao: r.icao,
            country: r.country,
            city: r.city,
            latitude: !!r.latitude ? parseFloat(r.latitude) : null,
            longitude: !!r.longitude ? parseFloat(r.longitude) : null,
            archive: r.archive,
        });
    }

}

export const airportRepository = new AirportRepository();