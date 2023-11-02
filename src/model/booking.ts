import { BookingStatus } from "./enum/booking-status";
import { Passenger } from "./passenger";
import { Flight } from "./flight";

export class Booking {
    public id: number | undefined;
    public status: BookingStatus | undefined;
    public seat: number | undefined;
    public passenger: Passenger;
    public flight: Flight;
}
