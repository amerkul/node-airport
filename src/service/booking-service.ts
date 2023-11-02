import CustomError from "../exception/custom-error";
import NotFoundException from "../exception/not-found-exception";
import { Booking } from "../model/booking";
import { BookingFilter } from "../model/filter/booking-filter";
import { bookingRepository } from "../repository/booking-repository";

class BookingService {

    async create(booking: Booking): Promise<Booking> {
        try {
            const bookingId = await bookingRepository.create(booking);
            booking.id = bookingId;
            return booking;
        } catch(err: any) {
            throw new CustomError(500, err.message);
        }
    }

    async retrieveById(id: number): Promise<Booking> {
        try {
            const booking = (await bookingRepository.findById(id)).shift();
            if (booking === undefined) {
                throw new NotFoundException(404, `Booking with id = ${id} doesn't exist`);
            }
            return booking;
        } catch(err: any) {
            throw new CustomError(err.code || 500, err.message);
        }
    }

    async update(newData: Booking, id: number): Promise<Booking> {
        try {
            newData.id = id;
            await bookingRepository.update(newData);
            return this.retrieveById(id);
        } catch(err: any) {
            throw new CustomError(err.code || 500, err.message);
        }
    }

    async delete(id: number): Promise<void> {
        try {
            await bookingRepository.delete(id);
        } catch (err: any) {
            throw new CustomError(500, err.message);
        }
    }

    async retrieveAll(offset: number, size: number): Promise<Booking[]> {
        try {
            return await bookingRepository.search(new BookingFilter(), offset, size);
        } catch(err: any) {
            throw new CustomError(500, err.message);
        }
    }

    async retrieveByFilter(filter: BookingFilter, offset: number, size: number): Promise<Booking[]> {
        try {
            return await bookingRepository.search(filter, offset, size);
        } catch(err: any) {
            throw new CustomError(500, err.message);
        }
    }

    async retrieveUserBookingsByFilter(filter: BookingFilter, userId: number, offset: number, size: number): Promise<Booking[]> {
        try {
            return await bookingRepository.findUserBookings(filter, userId, offset, size);
        } catch(err: any) {
            throw new CustomError(500, err.message);
        }
    }

}

export const bookingService = new BookingService();
