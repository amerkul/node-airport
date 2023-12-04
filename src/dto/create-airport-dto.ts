export class CreateAirportDto {
    public name: string;
    public country: string;
    public city: string;
    public iata: string;
    public icao: string;
    public latitude: number | undefined;
    public longitude: number | undefined;
}