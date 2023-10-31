export class Airport {
        public id: number | undefined;
        public name: string | undefined;
        public iata?: string | undefined;
        public icao?: string | undefined;
        public country: string | undefined;
        public city: string | undefined;
        public latitude?: number | undefined | null;
        public longitude?: number | undefined | null;
        public archive?: boolean | undefined;
}
