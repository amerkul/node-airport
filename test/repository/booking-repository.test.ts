import { bookingRepository } from "../../src/repository/booking-repository";
import { Booking } from "../../src/model/booking";
import { PGTestContainer } from "./pg-container";
import { Passenger } from "../../src/model/passenger";
import { Flight } from "../../src/model/flight";
import { BookingFilter } from "../../src/model/filter/booking-filter";
import { BookingStatus } from "../../src/model/enum/booking-status";

describe('Passenger repository', () => {
    
    const testContainer = new PGTestContainer();

    beforeAll(async () => {
        await testContainer.init();
    }, 60000);

    afterAll(async () => {
        await testContainer.destroy();
    }, 60000);

    it("should return a booking with id = 1", async () => {
        const result: Booking[] = await bookingRepository.findById(1);
        expect(result[0]).toEqual(
            {
                id: 1,
                seat: 10,
                status: 'Reserved',
                passenger: { 
                    id: 1, 
                    fullName: 'Anna Merkul'
                },
                flight: { 
                    id: 1, 
                    from: {
                        city: "Minsk",
                        country: "Belarus",
                        id: 1,
                        name: "National Airport Minsk",
                    }, 
                    to: {
                        city: "Brussels",
                        country: "Belgium",
                        id: 2,
                        name: "Brussels International Airport",
                    }, 
                    price: 400
                }
            }
        );
    }, 60000);

    it("should create a booking with id = 2", async () => {
        const booking = new Booking();
        booking.seat = 2;
        const passenger = new Passenger()
        passenger.id = 1;
        const flight = new Flight()
        flight.id = 2;
        booking.passenger = passenger;
        booking.flight = flight;
        const result = await bookingRepository.create(booking);
        expect(result).toEqual(2);
    }, 60000);

    it('should update the booking with id = 2', async () => {
        const booking = new Booking();
        booking.id = 2;
        booking.seat = 4;
        const passenger = new Passenger()
        passenger.id = 1;
        const flight = new Flight()
        flight.id = 1;
        booking.passenger = passenger;
        booking.flight = flight;
        await bookingRepository.update(booking);
        const result = await bookingRepository.findById(2);
        expect(result[0]).toEqual({
          id: 2,
          seat: 4,
          status: 'Reserved',
          passenger: { 
            id: 1, 
            fullName: 'Anna Merkul' },
          flight: { 
            id: 2, 
            from: {
                city: "Brussels",
                country: "Belgium",
                id: 2,
                name: "Brussels International Airport",
            },  
            to: {
                city: "Minsk",
                country: "Belarus",
                id: 1,
                name: "National Airport Minsk",
            },  
            price: 500
        }
        });
    }, 60000);

    it("should delete the booking with id = 2", async () => {
        expect(async() => await bookingRepository.delete(2)).not.toThrow();
    }, 60000);

    it("should get all bookings", async () => {
        const result: Booking[] = await bookingRepository.search(new BookingFilter(), 0, 10);
        expect(result).toEqual([{
            id: 1,
            seat: 10,
            status: 'Reserved',
            passenger: { 
                id: 1, 
                fullName: 'Anna Merkul'
            },
            flight: { 
                id: 1, 
                from: {
                    city: "Minsk",
                    country: "Belarus",
                    id: 1,
                    name: "National Airport Minsk",
                }, 
                to: {
                    city: "Brussels",
                    country: "Belgium",
                    id: 2,
                    name: "Brussels International Airport",
                }, 
                price: 400
            }
        }]);
    }, 60000);

    it("should get an empty booking list", async () => {
        const filter = new BookingFilter();
        filter.status = BookingStatus.CANCELLED;
        const result: Booking[] = await bookingRepository.search(filter, 0, 10);
        expect(result).toEqual([]);
    }, 60000);
    
});
