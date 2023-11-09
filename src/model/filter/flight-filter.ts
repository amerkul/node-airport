import { FlightStatus } from "../enum/flight-status";

export class FlightFilter {
    public fromCountry?: string;
    public fromCity?: string;
    public toCountry?: string;
    public toCity?: string;
    public status?: FlightStatus;
    public ids?: number[];
    public depatureDate?: string;
    public arrivalDate?: string;
    public airplaneId?: number;
    public page: number;
    public per_page: number;
}