import { FlightStatus } from "./enum/flight-status";
import { Airport } from "./airport";
import { Airplane } from "./airplane";
import { Airline } from "./airline";

export class Flight {
    public id?: number | undefined;
    public depature?: string | undefined;
    public arrival?: string | undefined;
    public price?: number | undefined;
    public status?: FlightStatus | undefined;
    public from?: Airport;
    public to?: Airport;
    public airplane?: Airplane;
    public airline?: Airline;
}
