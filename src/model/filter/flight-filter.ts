import { FlightStatus } from "../enum/flight-status";

export class FlightFilter {
    public fromCountry: string;
    public fromCity: string;
    public toCountry: string;
    public toCity: string;
    public status: FlightStatus | undefined;
    public ids: number[] | undefined;
    public depatureDate: string | undefined;
    public arrivalDate: string | undefined;
    public airplaneId: number | undefined;
    public page: number;
    public per_page: number;
}