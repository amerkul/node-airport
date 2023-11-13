import { airlineRepository } from "../../src/repository/airline-repository"
import { Airline } from "../../src/model/airline";
import { AirlineFilter } from "../../src/model/filter/airline-filter";
import { PGTestContainer } from "./pg-container";

describe('Airline repository', () => {
    
    const testContainer = new PGTestContainer();

    beforeAll(async () => {
        await testContainer.init();
    }, 60000);

    afterAll(async () => {
        await testContainer.destroy();
    }, 60000);

    it("should return an airline with id = 1", async () => {
        const result: Airline[] = await airlineRepository.findById(1);
        expect(result[0]).toEqual({
            id: 1,
            name: 'Belavia',
            iata: 'B2',
            archive: false
        });
    }, 60000);

    it("should create an airline with id = 4", async () => {
        const airline = new Airline();
        airline.iata = 'TT';
        airline.name = 'Test airline';
        const result = await airlineRepository.create(airline, 1);
        expect(result).toEqual(4);
    }, 60000);

    it('should update the airline with id = 4', async () => {
        const airline = new Airline();
        airline.id = 4;
        airline.iata = 'OO';
        airline.name = 'Test name';
        await airlineRepository.update(airline);
        const result = await airlineRepository.findById(4);
        expect(result[0].iata).toEqual('OO');
    }, 60000);

    it("should delete an airline with id = 4", async () => {
        expect(async() => await airlineRepository.delete(4)).not.toThrow();
    }, 60000);

    it("should get all airlines", async () => {
        const result: Airline[] = await airlineRepository.search(new AirlineFilter(), 0, 10);
        expect(result).toEqual([
            {
              id: 1,
              name: 'Belavia',
              archive: false,
              iata: 'B2'
            },
            {
              id: 2,
              name: 'Brussels Airlines',
              archive: false,
              iata: 'SN',
            },
            {
              id: 3,
              name: 'TUI fly Belgium',
              archive: false,
              iata: 'TB',
            }
          ]);
    }, 60000);

    it("should get airline with id = 1", async () => {
        const filter = new AirlineFilter();
        filter.airportId = 1;
        filter.ids = [1,2,3];
        filter.name = 'avia';
        const result: Airline[] = await airlineRepository.search(filter, 0, 10);
        expect(result).toEqual([
            {
                id: 1,
                name: 'Belavia',
                archive: false,
                iata: 'B2'
            },
        ]);
    }, 60000);
    
});
