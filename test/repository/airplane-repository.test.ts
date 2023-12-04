import { airplaneRepository } from "../../src/repository/airplane-repository"
import { Airplane } from "../../src/model/airplane";
import { AirplaneFilter } from "../../src/model/filter/airplane-filter";
import { PGTestContainer } from "./pg-container";

describe('Airplane repository', () => {
    
    const testContainer = new PGTestContainer();

    beforeAll(async () => {
        await testContainer.init();
    }, 60000);

    afterAll(async () => {
        await testContainer.destroy();
    }, 60000);

    it("should return an airplane with id = 1", async () => {
        const result: Airplane[] = await airplaneRepository.findById(1);
        expect(result[0]).toEqual({
            id: 1,
            name: 'Boeing 737-500',
            capacity: 125,
            archive: false
        });
    }, 60000);

    it("should create an airplane with id = 5", async () => {
        const airplane = new Airplane();
        airplane.capacity = 100;
        airplane.name = 'Test airplane';
        const result = await airplaneRepository.create(airplane, 1);
        expect(result).toEqual(5);
    }, 60000);

    it('should update the airplane with id = 5', async () => {
        const airplane = new Airplane();
        airplane.id = 5;
        airplane.capacity = 105;
        airplane.name = 'Test name';
        airplane.archive = true;
        await airplaneRepository.update(airplane);
        const result = await airplaneRepository.findById(5);
        expect(result[0]).toEqual({
            id: 5,
            name: 'Test name',
            capacity: 105,
            archive: true
        });
    }, 60000);

    it("should delete an airplane with id = 5", async () => {
        expect(async() => await airplaneRepository.delete(5)).not.toThrow();
    }, 60000);

    it("should get all airplanes", async () => {
        const result: Airplane[] = await airplaneRepository.search(new AirplaneFilter(), 0, 10);
        expect(result).toEqual([
            {
              id: 1,
              name: 'Boeing 737-500',
              capacity: 125,
              archive: false
            },
            {
              id: 2,
              name: 'Boeing 737-800',
              archive: false,
              capacity: 222,
            },
            {
              id: 3,
              name: 'Airbus A330-300',
              archive: false,
              capacity: 215,
            },
            {
              id: 4,
              name: 'Airbus A320-200',
              archive: false,
              capacity: 156,
            }
          ]);
    }, 60000);

    it("should get airplanes with id = 1, 2", async () => {
        const filter = new AirplaneFilter();
        filter.airlineId = 1;
        filter.name = 'boe';
        filter.archive = false;
        const result: Airplane[] = await airplaneRepository.search(filter, 0, 10);
        expect(result).toEqual([
            {
                id: 1,
                name: 'Boeing 737-500',
                capacity: 125,
                archive: false
            },
            {
                id: 2,
                name: 'Boeing 737-800',
                archive: false,
                capacity: 222,
            },
        ]);
    }, 60000);
    
});
