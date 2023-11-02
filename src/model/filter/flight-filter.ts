import { FlightStatus } from "../enum/flight-status";

export class FlightFilter {
    public fromCountry: string | undefined;
    public toCountry: string | undefined;
    public status: FlightStatus | undefined;
    public ids: number[] | undefined;
    public depatureDate: string | undefined;
    public arrivalDate: string | undefined;
}