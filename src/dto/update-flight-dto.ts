export class UpdateFlightDto {
    public from_id?: number | undefined;
    public to_id?: number | undefined;
    public depature?: string | undefined;
    public arrival?: string | undefined;
    public price?: number | undefined;
    public status?: string | undefined;
    public airplane_id?: number;
    public airline_id?: number;
}