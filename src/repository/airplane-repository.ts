import { pool } from "../connector/pg-pool";
import { Airplane } from "../model/airplane";
import { AirplaneFilter } from "../model/filter/airplane-filter";

class AirplaneRepository {

    async create(airplane: Airplane, airlineId: number): Promise<number> {
        const result = await pool.query(`
        INSERT INTO airplanes (name, capacity, airline_id)
        VALUES ($1, $2, $3) RETURNING airplane_id`, [
            airplane.name,
            airplane.capacity,
            airlineId
        ]);
        return result.rows[0].airplane_id;
    }

    async findById(id: number): Promise<Airplane[]> {
        const result = await pool.query(`
        SELECT airplane_id, name, capacity, archive 
        FROM airplanes WHERE airplane_id = $1`, [id]);
        return result.rows.map(r => this.projectAirplane(r));
    }

    async delete(id: number): Promise<void> {
        await pool.query(`
        DELETE FROM airplanes 
        WHERE airplane_id = $1`, [id]);
    }

    async update(newData: Airplane): Promise<void> {
        let query = `UPDATE airplanes SET `
        const params: string[] = [];
        if (newData.name !== undefined) {
            params.push(`name = '${newData.name}'`);
        } 
        if (newData.archive !== undefined) {
            params.push(`archive = ${newData.archive}`);
        }
        if (newData.capacity !== undefined) {
            params.push(`capacity = '${newData.capacity}'`);
        }
        query += params.join(', ') + ` WHERE airplane_id = ${newData.id}`;
        await pool.query(query);
    }

    async search(filter: AirplaneFilter, offset: number, size: number): Promise<Airplane[]> {
        let query = `
        SELECT airplane_id, name, archive, capacity FROM airplanes `;
        const params: string[] = [];
        if (filter.ids) {
            params.push(` airplane_id in (${filter.ids.join(', ')}) `);
        } 
        if (filter.archive !== undefined) {
            params.push(` archive = ${filter.archive} `);
        }
        if (filter.name !== undefined) {
            params.push(` name ILIKE '%${filter.name}%' `);
        }
        if (filter.airlineId !== undefined) {
            params.push(` airline_id = ${filter.airlineId} `);
        }
        if (params.length > 0) {
            query += `WHERE ${params.join('AND')} `;
        }
        query += `OFFSET ${offset} LIMIT ${size}`;
        const result = await pool.query(query);
        return result.rows.map(r => this.projectAirplane(r));
    }

    public projectAirplane(r: any): Airplane {
        return ({
            id: r.airplane_id,
            name: r.name,
            capacity: r.capacity,
            archive: r.archive,
        });
    }
}

export const airplaneRepository = new AirplaneRepository();