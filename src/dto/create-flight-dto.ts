export class CreateFlightDto {
    public from_id?: number;
    public to_id?: number;
    public depature?: string;
    public arrival?: string;
    public price?: number;
    public airplane_id?: number;
    public airline_id?: number;
}