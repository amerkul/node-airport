import { airportRepository } from "../../src/repository/airport-repository"
import { Airport } from "../../src/model/airport";
import { AirportFilter } from "../../src/model/filter/airport-filter";
import { PGTestContainer } from "./pg-container";

describe('Airport repository', () => {
    
    let testContainer = new PGTestContainer();

    beforeAll(async () => {
        await testContainer.init();
    }, 60000);

    afterAll(async () => {
        await testContainer.destroy();
    }, 60000);

    it("should return an airport with id = 1", async () => {
        const result: Airport[] = await airportRepository.findById(1);
        expect(result[0]).toEqual({
            id: 1,
            name: 'National Airport Minsk',
            iata: 'MSQ',
            icao: 'UMMS',
            country: 'Belarus',
            city: 'Minsk',
            latitude: 53.882222,
            longitude: 28.030556,
            archive: false
        });
    }, 60000);

    it("should create an airport with id = 3", async () => {
        const airport = new Airport();
        airport.city = 'Test_city';
        airport.country = 'Test_country';
        airport.iata = 'KKK';
        airport.icao = 'LLLL';
        airport.name = 'Test_name';
        const result = await airportRepository.createAirport(airport);
        expect(result).toEqual(3);
    }, 60000);

    it('should update the airport with id = 3', async () => {
        const airport = new Airport();
        airport.id = 3;
        airport.iata = 'OOO';
        airport.name = 'Test name';
        await airportRepository.update(airport);
        const result = await airportRepository.findById(3);
        expect(result[0].iata).toEqual('OOO');
    }, 60000);

    it("should delete an airport with id = 3", async () => {
        expect(async() => await airportRepository.delete(3)).not.toThrow();
    }, 60000);

    it("should get all airports", async () => {
        const result: Airport[] = await airportRepository.search(new AirportFilter(), 0, 10);
        expect(result).toEqual([
            {
              id: 1,
              name: 'National Airport Minsk',
              archive: false,
              country: 'Belarus',
              city: 'Minsk',
              latitude: 53.882222,
              longitude: 28.030556,
              iata: 'MSQ',
              icao: 'UMMS'
            },
            {
              id: 2,
              name: 'Brussels International Airport',
              archive: false,
              country: 'Belgium',
              city: 'Brussels',
              latitude: 50.846667,
              longitude: 4.3525,
              iata: 'BRU',
              icao: 'EBBR'
            }
          ]);
    }, 60000);

    it("should get airport with id = 1", async () => {
        const filter = new AirportFilter();
        filter.city = 'minsk';
        filter.country = 'bel';
        filter.name = 'air';
        const result: Airport[] = await airportRepository.search(filter, 0, 10);
        expect(result).toEqual([
            {
              id: 1,
              name: 'National Airport Minsk',
              archive: false,
              country: 'Belarus',
              city: 'Minsk',
              latitude: 53.882222,
              longitude: 28.030556,
              iata: 'MSQ',
              icao: 'UMMS'
            }
          ]);
    }, 60000);
    
});
