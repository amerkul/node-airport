import { pool } from '../connector/pg-pool';
import { Airport } from '../model/airport';
import { AirportFilter } from '../model/filter/airport-filter';

class AirportRepository {

    async createAirport(airport: Airport): Promise<Airport[]> {
        const result = await pool.query(
            `INSERT INTO airports (name, iata, icao, country, city, latitude, longitude)
             VALUES ($1, $2, $3, $4, $5, $6, $7)`, [
                airport.name,
                airport.iata,
                airport.icao,
                airport.country,
                airport.city,
                airport.latitude || null,
                airport.longitude || null,
        ]);
        return result.rows.map(r => this.projectAirport(r));
    }

    async findById(id: number): Promise<Airport[]> {
        const result = await pool.query(
            `SELECT airport_id, name, iata, icao, country, city, latitude, longitude, archive
             FROM airports 
             WHERE airport_id = $1`, [id]
        ) ;
        return result.rows.map(r => this.projectAirport(r));
    }

    async update(newData: Airport, id: number): Promise<Airport[]> {
        let query = `UPDATE airports SET `
        for (let key in newData) {
            let i = 0;
            if (newData[key] !== undefined) {
                query += `${key}=$${++i}, `
            } 
        }
        query = query.substring(0, query.length - 2) + ` WHERE airport_id = ${id}`;
        const result = await pool.query(query);
        return result.rows.map(r => this.projectAirport(r));
    }

    async delete(id: number): Promise<void> {
        pool.query(`DELETE FROM airports WHERE airport_id = ${id}`);
    }

    async search(filter: AirportFilter, offset: number, size: number) {
        let query = `
        SELECT airport_id, name, archive, country, city, latitude, 
        longitude, iata, icao FROM airports
        WHERE `;
        if (filter.ids) {
            query += `airport_id in (${filter.ids.join(', ')}) `;
        } 
        if (filter.archive !== undefined) {
            query += `&& archive = ${filter.archive} `;
        }
        if (filter.name !== undefined) {
            query += `&& name = ${filter.name} `;
        }
        if (filter.country !== undefined) {
            query += `&& country = ${filter.country} `;
        }
        if (filter.city !== undefined) {
            query += `&& city = ${filter.city} `;
        }
        query += `OFFSET ${offset} LIMIT ${size}`;
        const result = await pool.query(query);
        return result.rows.map(r => this.projectAirport(r));
    }

    private projectAirport(r: any): Airport {
        return ({
            id: r.airport_id,
            name: r.name,
            iata: r.iata,
            icao: r.icao,
            country: r.country,
            city: r.city,
            latitude: r.latitude,
            longitude: r.longitude,
            archive: r.archive,
        });
    }

}

export const airportRepository = new AirportRepository();