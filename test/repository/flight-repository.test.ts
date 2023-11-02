import { flightRepository } from "../../src/repository/flight-repository"
import { Flight } from "../../src/model/flight";
import { PGTestContainer } from "./pg-container";
import { Airline } from "../../src/model/airline";
import { Airplane } from "../../src/model/airplane";
import { Airport } from "../../src/model/airport";
import { FlightStatus } from "../../src/model/enum/flight-status";
import { FlightFilter } from "../../src/model/filter/flight-filter";

let testContainer = new PGTestContainer();

beforeAll(async () => {
    await testContainer.init();
}, 60000);

describe('Flight repository', () => {

    it("should create a flight with id = 3", async () => {
        const airline = new Airline();
        airline.id = 2;
        const airplane = new Airplane();
        airplane.id = 1;
        const from = new Airport();
        from.id = 1;
        const to = new Airport();
        to.id = 2;
        const flight = new Flight();
        flight.depature = '2023-10-30 01:00:00';
        flight.arrival = '2023-10-30 03:00:00';
        flight.price = 500;
        flight.from = from;
        flight.to = to;
        flight.airline = airline;
        flight.airplane = airplane;
        const result = await flightRepository.create(flight);
        expect(result).toEqual(3);
    }, 60000);

    it('should update the flight with id = 3', async () => {
        const flight = new Flight();
        flight.id = 3
        flight.depature = '2023-10-29 01:00:00';
        flight.status = FlightStatus.CANCELLED;
        await flightRepository.update(flight);
        const result = await flightRepository.findById(3);
        expect(result[0]).toEqual({
            id: 3,
            depature: '2023-10-29 01:00:00',
            arrival: '2023-10-30 03:00:00',
            price: 500,
            status: 'Cancelled',
            from: {
                id: 1,
                name: "National Airport Minsk",
                country: "Belarus",
                city: "Minsk"
            },
            to: {
                id: 2,
                name: "Brussels International Airport",
                country: "Belgium",
                city: "Brussels"
            },
            airline: {
                id: 2,
                name: "Brussels Airlines"
            },
            airplane: {
                id: 1,
                name: "Boeing 737-500"
            }
        });
    }, 60000);

    it("should delete a flight with id = 3", async () => {
        expect(async() => await flightRepository.delete(3)).not.toThrow();
    }, 60000);

    it("should return a flight with id = 1", async () => {
        const result: Flight[] = await flightRepository.findById(1);
        expect(result[0]).toEqual({
            id: 1,
            depature: '2023-10-31 00:00:00',
            arrival: '2023-11-01 00:00:00',
            price: 400.00,
            status: 'Scheduled',
            from: {
                id: 1,
                name: "National Airport Minsk",
                country: "Belarus",
                city: "Minsk"
            },
            to: {
                id: 2,
                name: "Brussels International Airport",
                country: "Belgium",
                city: "Brussels"
            },
            airline: {
                id: 1,
                name: "Belavia"
            },
            airplane: {
                id: 1,
                name: "Boeing 737-500"
            }
        });
    }, 60000);
    
    it("should get all flights", async () => {
        const result: Flight[] = await flightRepository.search(new FlightFilter(), 0, 10);
        console.log(result);
        expect(result).toEqual([{
            id: 1,
            depature: '2023-10-31 00:00:00',
            arrival: '2023-11-01 00:00:00',
            price: 400,
            status: 'Scheduled',
            from: {
              id: 1,
              name: 'National Airport Minsk',
              country: 'Belarus',
              city: 'Minsk'
            },
            to: {
              id: 2,
              name: 'Brussels International Airport',
              country: 'Belgium',
              city: 'Brussels'
            },
            airline: { id: 1, name: 'Belavia' },
            airplane: { id: 1, name: 'Boeing 737-500' }
          },
          {
            id: 2,
            depature: '2023-11-01 00:00:00',
            arrival: '2023-11-02 00:00:00',
            price: 500,
            status: 'Scheduled',
            from: {
              id: 2,
              name: 'Brussels International Airport',
              country: 'Belgium',
              city: 'Brussels'
            },
            to: {
              id: 1,
              name: 'National Airport Minsk',
              country: 'Belarus',
              city: 'Minsk'
            },
            airline: { id: 2, name: 'Brussels Airlines' },
            airplane: { id: 2, name: 'Boeing 737-800' }
          }]);
    }, 60000);

    it("should get a flight with id = 1,2", async () => {
        const filter = new FlightFilter();
        filter.fromCountry = 'bel';
        const result: Flight[] = await flightRepository.search(filter, 0, 10);
        expect(result).toEqual([{
            id: 1,
            depature: '2023-10-31 00:00:00',
            arrival: '2023-11-01 00:00:00',
            price: 400,
            status: 'Scheduled',
            from: {
              id: 1,
              name: 'National Airport Minsk',
              country: 'Belarus',
              city: 'Minsk'
            },
            to: {
              id: 2,
              name: 'Brussels International Airport',
              country: 'Belgium',
              city: 'Brussels'
            },
            airline: { id: 1, name: 'Belavia' },
            airplane: { id: 1, name: 'Boeing 737-500' }
          },
          {
            id: 2,
            depature: '2023-11-01 00:00:00',
            arrival: '2023-11-02 00:00:00',
            price: 500,
            status: 'Scheduled',
            from: {
              id: 2,
              name: 'Brussels International Airport',
              country: 'Belgium',
              city: 'Brussels'
            },
            to: {
              id: 1,
              name: 'National Airport Minsk',
              country: 'Belarus',
              city: 'Minsk'
            },
            airline: { id: 2, name: 'Brussels Airlines' },
            airplane: { id: 2, name: 'Boeing 737-800' }
          },]);
    }, 60000);
    
});

afterAll(async () => {
    await testContainer.destroy();
}, 60000);