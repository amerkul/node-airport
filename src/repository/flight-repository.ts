import { Flight } from "../model/flight";
import { pool } from "../connector/pg-pool";
import { FlightStatus } from "../model/enum/flight-status";
import { FlightFilter } from "../model/filter/flight-filter";

class FlightRepository {

    async create(flight: Flight): Promise<number> {
        const result = await pool.query(`
        INSERT INTO flights (depature, arrival, price,
        from_id, to_id, airplane_id, airline_id)
        VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING flight_id`, [
            flight.depature,
            flight.arrival,
            flight.price,
            flight.from?.id,
            flight.to?.id,
            flight.airplane?.id,
            flight.airline?.id
        ]);
        return result.rows[0].flight_id;
    }

    async findById(id: number): Promise<Flight[]> {
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
        WHERE flights.flight_id = $1`, [id]);
        return result.rows.map(r => this.projectFlight(r));
    }

    async delete(id: number): Promise<void> {
        await pool.query(`
        DELETE FROM flights
        WHERE flight_id = $1`, [id]);
    }

    async update(newData: Flight): Promise<void> {
        let query = `
        UPDATE flights
        SET `;
        const params: string[] = [];
        if (newData.depature !== undefined) {
            params.push(` depature = '${newData.depature}' `);
        } 
        if (newData.arrival !== undefined) {
            params.push(` arrival = '${newData.arrival}' `);
        }
        if (newData.price !== undefined) {
            params.push(` price = ${newData.price} `);
        }
        if (newData.status !== undefined) {
            params.push(` status = '${newData.status}' `);
        }
        if (newData.from?.id !== undefined) {
            params.push(` from_id = ${newData.from.id} `);
        }
        if (newData.to?.id !== undefined) {
            params.push(` to_id = ${newData.to.id} `);
        }
        if (newData.airline?.id !== undefined) {
            params.push(` airline_id = ${newData.airline.id} `);
        }
        if (newData.airplane?.id !== undefined) {
            params.push(` airplane_id = ${newData.airplane.id} `);
        }
        query += params.join(', ') + ` WHERE flight_id = ${newData.id}`;
        await pool.query(query);
    }

    async search(filter: FlightFilter, offset: number, size: number): Promise<Flight[]> {
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
        if (params.length > 0) {
            query += ` WHERE ${params.join('AND')}`;
        }
        query += ` OFFSET ${offset} LIMIT ${size}`;
        const result = await pool.query(query);
        return result.rows.map(r => this.projectFlight(r));
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
                name: r.airplane_name
            }
        });
    }

}

export const flightRepository = new FlightRepository();
