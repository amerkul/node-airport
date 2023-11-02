import { FlightFilter } from "../../src/model/filter/flight-filter";
import { Flight } from "../../src/model/flight";
import { flightService } from "../../src/service/flight-service";
import { PGTestContainer } from "../repository/pg-container";

describe('Flight service', () => {

    let testContainer = new PGTestContainer();

    beforeAll(async () => {
        await testContainer.init();
    }, 60000);

    afterAll(async () => {
        await testContainer.destroy();
    }, 60000);
    
    it('should return flights from Belarus, Minsk to Belgium, Brussels', async () => {
        const filter = new FlightFilter();
        filter.depatureDate = '2023-09-01 05:00:00';
        filter.arrivalDate = '2023-12-01 05:00:00';
        filter.fromCountry = 'Belarus';
        filter.fromCity = 'Minsk';
        filter.toCountry = 'Belgium';
        filter.toCity = 'Brussels';
        const paths: Flight[] = await flightService.retrieveAllWays(filter, 0 , 10);
        console.log(paths);
        expect(paths.length).toBe(1);
    }, 60000);

});
