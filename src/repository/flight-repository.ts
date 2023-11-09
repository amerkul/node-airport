import { Flight } from "../model/flight";
import { pool } from "../connector/pg-pool";
import { FlightStatus } from "../model/enum/flight-status";
import { FlightFilter } from "../model/filter/flight-filter";
import CustomError from "../exception/custom-error";

class FlightRepository {

    async create(flight: Flight): Promise<number> {
        try {
            const result = await pool.query(`
            INSERT INTO flights (depature, arrival, price,
            from_id, status, to_id, airplane_id, airline_id)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING flight_id`, [
                flight.depature,
                flight.arrival,
                flight.price,
                flight.from?.id,
                flight.status,
                flight.to?.id,
                flight.airplane?.id,
                flight.airline?.id
            ]);
            return result.rows[0].flight_id;
        } catch(e: any) {
            throw new CustomError(500, e.message);
        }
    }

    async findById(id: number): Promise<Flight[]> {
        try {
            const result = await pool.query(`
            SELECT flight_id, depature::text, 
            arrival::text, price, status,
            from_id, from_a.name AS from_name, 
            from_a.country AS from_country, 
            from_a.city AS from_city,
            to_id, to_a.name AS to_name, 
            to_a.country AS to_country, 
            to_a.city AS to_city,  
            flights.airplane_id, airplanes.name AS airplane_name, 
            flights.airline_id, airlines.name AS airline_name,
            airplanes.capacity AS airplane_capacity
            FROM flights
            JOIN airports AS from_a 
            ON flights.from_id = from_a.airport_id
            JOIN airports AS to_a
            ON flights.to_id = to_a.airport_id
            JOIN airlines 
            ON flights.airline_id = airlines.airline_id
            JOIN airplanes 
            ON flights.airplane_id = airplanes.airplane_id
            WHERE flights.flight_id = $1`, [id]);
            return result.rows.map(r => this.projectFlight(r));
        } catch(e: any) {
            throw new CustomError(500, e.message);
        }
    }

    async delete(id: number): Promise<void> {
        try {
            await pool.query(`CALL delete_flight($1)`, [id]);
        } catch(e: any) {
            throw new CustomError(500, e.message);
        }
    }

    async update(newData: Flight): Promise<void> {
        try {
            await pool.query('CALL update_flight($1 ,$2, $3, $4, $5, $6, $7, $8, $9)',[
                newData.depature?.toString(),
                newData.arrival?.toString(),
                newData.price,
                newData.status, 
                newData.from?.id,
                newData.to?.id,
                newData.airline?.id,
                newData.airplane?.id,
                newData.id
            ]);
        } catch(e: any) {
            throw new CustomError(500, e.message);
        }
        
    }

    async search(filter: FlightFilter, offset: number | null, size: number | null): Promise<Flight[]> {
        try {
            let query = `
            SELECT flight_id, depature::text, 
            arrival::text, price, status,
            from_id, from_a.name AS from_name, 
            from_a.country AS from_country, 
            from_a.city AS from_city,
            to_id, to_a.name AS to_name, 
            to_a.country AS to_country, 
            to_a.city AS to_city,  
            flights.airplane_id, airplanes.name AS airplane_name, 
            flights.airline_id, airlines.name AS airline_name,
            airplanes.capacity AS airplane_capacity
            FROM flights
            JOIN airports AS from_a 
            ON flights.from_id = from_a.airport_id
            JOIN airports AS to_a
            ON flights.to_id = to_a.airport_id
            JOIN airlines 
            ON flights.airline_id = airlines.airline_id
            JOIN airplanes 
            ON flights.airplane_id = airplanes.airplane_id`;
            const params: string[] = [];
            if (filter.depatureDate !== undefined) {
                params.push(` DATE(depature) >= '${filter.depatureDate}'::date `);
            } 
            if (filter.arrivalDate !== undefined) {
                params.push(` DATE(arrival) <= '${filter.arrivalDate}'::date `);
            }
            if (filter.status !== undefined) {
                params.push(` status = '${filter.status}' `);
            }
            if (filter.fromCountry !== undefined) {
                params.push(` from_a.country ILIKE '%${filter.fromCountry}%' `);
            }
            if (filter.toCountry !== undefined) {
                params.push(` to_a.country ILIKE '%${filter.toCountry}%' `);
            }
            if (filter.ids !== undefined) {
                params.push(` flight_id IN (${filter.ids.join(', ')}) `);
            }
            if (filter.airplaneId !== undefined) {
                params.push(` airplanes.airplane_id = ${filter.airplaneId} `);
            }
            if (params.length > 0) {
                query += ` WHERE ${params.join('AND')}`;
            }
            if (offset !== null && size !== null) {
                query += ` OFFSET ${offset} LIMIT ${size}`;
            }
            const result = await pool.query(query);
            return result.rows.map(r => this.projectFlight(r));
        } catch(e: any) {
            throw new CustomError(500, e.message);
        }
    }

    async findTotalEntries(filter: FlightFilter): Promise<number> {
        try {
            let query = `
            SELECT COUNT(*) AS entries
            FROM flights
            JOIN airports AS from_a 
            ON flights.from_id = from_a.airport_id
            JOIN airports AS to_a
            ON flights.to_id = to_a.airport_id
            JOIN airlines 
            ON flights.airline_id = airlines.airline_id
            JOIN airplanes 
            ON flights.airplane_id = airplanes.airplane_id`;
            const params: string[] = [];
            if (filter.depatureDate !== undefined) {
                params.push(` DATE(depature) >= '${filter.depatureDate}'::date `);
            } 
            if (filter.arrivalDate !== undefined) {
                params.push(` DATE(arrival) <= '${filter.arrivalDate}'::date `);
            }
            if (filter.status !== undefined) {
                params.push(` status = '${filter.status}' `);
            }
            if (filter.fromCountry !== undefined) {
                params.push(` from_a.country ILIKE '%${filter.fromCountry}%' `);
            }
            if (filter.toCountry !== undefined) {
                params.push(` to_a.country ILIKE '%${filter.toCountry}%' `);
            }
            if (filter.ids !== undefined) {
                params.push(` flight_id IN (${filter.ids.join(', ')}) `);
            }
            if (filter.airplaneId !== undefined) {
                params.push(` airplanes.airplane_id = ${filter.airplaneId} `);
            }
            if (params.length > 0) {
                query += ` WHERE ${params.join('AND')}`;
            }
            const result = await pool.query(query);
            return result.rows[0].entries;
        } catch(e: any) {
            throw new CustomError(500, e.message);
        }
    }

    async findByUniqueParams(flight: Flight): Promise<Flight[]> {
        try {
            const params: string[] = [];
            let query = `
            SELECT flight_id, depature::text, 
            arrival::text, price, status,
            from_id, from_a.name AS from_name, 
            from_a.country AS from_country, 
            from_a.city AS from_city,
            to_id, to_a.name AS to_name, 
            to_a.country AS to_country, 
            to_a.city AS to_city,  
            flights.airplane_id, airplanes.name AS airplane_name, 
            flights.airline_id, airlines.name AS airline_name 
            FROM flights
            JOIN airports AS from_a 
            ON flights.from_id = from_a.airport_id
            JOIN airports AS to_a
            ON flights.to_id = to_a.airport_id
            JOIN airlines 
            ON flights.airline_id = airlines.airline_id
            JOIN airplanes 
            ON flights.airplane_id = airplanes.airplane_id 
            WHERE (('${flight.depature}' >= flights.depature
            AND '${flight.depature}' <= flights.arrival) OR
            ('${flight.arrival}' >= flights.depature
            AND '${flight.arrival}' <= flights.arrival)) AND 
            status NOT IN ('Cancelled') AND 
            flights.airplane_id = ${flight.airplane?.id}`;
            const result = await pool.query(query);
            return result.rows.map(r => this.projectFlight(r));
        } catch(e: any) {
            throw new CustomError(500, e.message);
        }
    }

    public projectFlight(r: any): Flight {
        return ({
            id: r.flight_id,
            depature: r.depature,
            arrival: r.arrival,
            price: parseFloat(r.price),
            status: r.status as FlightStatus,
            from: {
                id: r.from_id,
                name: r.from_name,
                country: r.from_country,
                city: r.from_city
            },
            to: {
                id: r.to_id,
                name: r.to_name,
                country: r.to_country,
                city: r.to_city
            },
            airline: {
                id: r.airline_id,
                name: r.airline_name
            },
            airplane: {
                id: r.airplane_id,
                name: r.airplane_name,
                capacity: r.airplane_capacity
            }
        });
    }

}

export const flightRepository = new FlightRepository();
