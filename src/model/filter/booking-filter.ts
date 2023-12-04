import { BookingStatus } from "../enum/booking-status";

export class BookingFilter {
    public status: BookingStatus | undefined;
    public ids: number[] | undefined;
    public page: number;
    public per_page: number;
}
