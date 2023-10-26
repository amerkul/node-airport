import { pool } from "../connector/pg-pool";
import { Airplane } from "../model/airplane";
import { AirplaneFilter } from "../model/filter/airplane-filter";

class AirplaneRepository {

    async create(airplane: Airplane): Promise<Airplane[]> {
        const result = await pool.query(`
        INSERT INTO airplanes (name, capacity)
        VALUES ($1, $2)`, [
            airplane.name,
            airplane.capacity
        ]);
        return result.rows.map(r => this.projectAirplane(r));
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

    async update(newData: Airplane, id: number): Promise<Airplane[]> {
        let query = `UPDATE airplanes SET `
        for (let key in newData) {
            let i = 0;
            if (newData[key] !== undefined) {
                query += `${key}=$${++i}, `
            } 
        }
        query = query.substring(0, query.length - 2) + ` WHERE airplane_id = ${id}`;
        const result = await pool.query(query);
        return result.rows.map(r => this.projectAirplane(r));
    }

    async search(filter: AirplaneFilter, offset: number, size: number): Promise<Airplane[]> {
        let query = `
        SELECT airplane_id, name, archive, capacity
        WHERE `;
        if (filter.ids) {
            query += `airplane_id in (${filter.ids.join(', ')}) `;
        } 
        if (filter.archive !== undefined) {
            query += `&& archive = ${filter.archive} `;
        }
        if (filter.name !== undefined) {
            query += `&& name = ${filter.name} `;
        }
        if (filter.airlineId !== undefined) {
            query += `&& airline_id = ${filter.airlineId} `;
        }
        query += `OFFSET ${offset} LIMIT ${size}`;
        const result = await pool.query(query);
        return result.rows.map(r => this.projectAirplane(r));
    }

    private projectAirplane(r): Airplane {
        return ({
            id: r.airplane_id,
            name: r.name,
            capacity: r.capacity,
            archive: r.archive,
        });
    }
}

export const airplaneRepository = new AirplaneRepository();