import { Booking } from "../model/booking";
import { pool } from "../connector/pg-pool";
import { BookingFilter } from "../model/filter/booking-filter";
import { BookingStatus } from "../model/enum/booking-status";

class BookingRepository {

    async create(booking: Booking): Promise<number> {
        const result = await pool.query(`
        INSERT INTO bookings (seat, passenger_id, flight_id)
        VALUES ($1, $2, $3) RETURNING booking_id`, [
            booking.seat,
            booking.passenger?.id,
            booking.flight?.id
        ]);
        return result.rows[0].booking_id;
    }

    async findById(id: number): Promise<Booking[]> {
        const result = await pool.query(`
        SELECT booking_id, seat, b.status, b.passenger_id 
        AS passenger_id, p.full_name AS passenger_name, 
        b.flight_id, from_a.airport_id AS from_id, 
        from_a.name AS from_name,
        from_a.country AS from_country, 
        from_a.city AS from_city, 
        to_a.airport_id AS to_id, 
        to_a.name AS to_name,
        to_a.country AS to_country, 
        to_a.city AS to_city, f.price, f.flight_id
        FROM bookings AS b
        JOIN passengers AS p ON p.passenger_id = b.passenger_id
        JOIN flights AS f ON f.flight_id = b.flight_id
        JOIN airports AS from_a ON from_a.airport_id = f.from_id
        JOIN airports AS to_a ON to_a.airport_id = f.to_id
        WHERE b.booking_id = $1`, [id]);
        return result.rows.map(r => this.projectBooking(r));
    }

    async delete(id: number): Promise<void> {
        await pool.query(`
        DELETE FROM bookings
        WHERE booking_id = $1`, [id]);
    }

    async update(newData: Booking): Promise<void> {
        let query = `
        UPDATE bookings
        SET `;
        const params: string[] = [];
        if (newData.seat !== undefined) {
            params.push(` seat = ${newData.seat} `);
        }
        if (newData.status !== undefined) {
            params.push(` status = '${newData.status}' `);
        }
        if (newData.passenger?.id !== undefined) {
            params.push(` passenger_id = ${newData.passenger.id} `);
        }
        if (newData.flight?.id !== undefined) {
            params.push(` flight_id = ${newData.flight.id} `);
        }
        query += params.join(', ') + ` WHERE booking_id = ${newData.id}`;
        await pool.query(query);
    }

    async search(filter: BookingFilter, offset: number, size: number): Promise<Booking[]> {
        let query = `
        SELECT booking_id, seat, b.status, b.passenger_id 
        AS passenger_id, p.full_name AS passenger_name, 
        b.flight_id, from_a.airport_id AS from_id, 
        from_a.name AS from_name,
        from_a.country AS from_country, 
        from_a.city AS from_city, 
        to_a.airport_id AS to_id, 
        to_a.name AS to_name,
        to_a.country AS to_country, 
        to_a.city AS to_city, f.price, f.flight_id
        FROM bookings AS b
        JOIN passengers AS p ON p.passenger_id = b.passenger_id
        JOIN flights AS f ON f.flight_id = b.flight_id
        JOIN airports AS from_a ON from_a.airport_id = f.from_id
        JOIN airports AS to_a ON to_a.airport_id = f.to_id `;
        const params: string[] = [];
        if (filter.ids !== undefined) {
            params.push(` ids IN (${filter.ids.join(', ')} )`);
        }
        if (filter.status !== undefined) {
            params.push(` b.status = '${filter.status}' `);
        }
        if (params.length > 0) {
            query += `WHERE ${params.join('AND')}`;
        }
        query += ` OFFSET ${offset} LIMIT ${size}`;
        const result = await pool.query(query);
        return result.rows.map(r => this.projectBooking(r));
    }

    async findUserBookings(filter: BookingFilter, userId: number, offset: number, size: number): Promise<Booking[]> {
        let query = `
        SELECT booking_id, seat, b.status, b.passenger_id 
        AS passenger_id, p.full_name AS passenger_name, 
        b.flight_id, from_a.airport_id AS from_id, 
        from_a.name AS from_name,
        from_a.country AS from_country, 
        from_a.city AS from_city, 
        to_a.airport_id AS to_id, 
        to_a.name AS to_name,
        to_a.country AS to_country, 
        to_a.city AS to_city, f.price, f.flight_id
        FROM bookings AS b
        JOIN passengers AS p ON p.passenger_id = b.passenger_id
        JOIN flights AS f ON f.flight_id = b.flight_id
        JOIN airports AS from_a ON from_a.airport_id = f.from_id
        JOIN airports AS to_a ON to_a.airport_id = f.to_id 
        JOIN users AS u ON u.user_id = p.user_id
        WHERE u.user_id = ${userId} AND `;
        const params: string[] = [];
        if (filter.ids !== undefined) {
            params.push(` ids IN (${filter.ids.join(', ')} )`);
        }
        if (filter.status !== undefined) {
            params.push(` b.status = '${filter.status}' `);
        }
        if (params.length > 0) {
            query += `${params.join('AND')}`;
        }
        query += ` OFFSET ${offset} LIMIT ${size}`;
        const result = await pool.query(query);
        return result.rows.map(r => this.projectBooking(r));
    }

    public projectBooking(r: any): Booking {
        return ({
            id: r.booking_id,
            seat: r.seat,
            status: r.status as BookingStatus,
            passenger: {
                id: r.passenger_id,
                fullName: r.passenger_name
            },
            flight: {
                id: r.flight_id,
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
                price: parseFloat(r.price)
            }
        });
    }

}

export const bookingRepository = new BookingRepository();
