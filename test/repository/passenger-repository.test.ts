import { passengerRepository } from "../../src/repository/passenger-repository"
import { Passenger } from "../../src/model/passenger";
import { PassengerFilter } from "../../src/model/filter/passenger-filter";
import { PGTestContainer } from "./pg-container";

describe('Passenger repository', () => {
    
    let testContainer = new PGTestContainer();

    beforeAll(async () => {
        await testContainer.init();
    }, 60000);

    afterAll(async () => {
        await testContainer.destroy();
    }, 60000);

    it("should return a passenger with id = 1", async () => {
        const result: Passenger[] = await passengerRepository.findById(1);
        expect(result[0]).toEqual({
            id: 1,
            fullName: 'Anna Merkul',
            email: 'amerkul@gmail.com',
            birthday: '2002-08-16',
            passport: 'MP7777777'
        });
    }, 60000);

    it("should create a passenger with id = 2", async () => {
        const passenger = new Passenger();
        passenger.fullName = 'Anna Merkul';
        passenger.birthday = '2002-08-16';
        passenger.email = 'anna.merkul@bk.ru';
        passenger.passport = 'MP1111111';
        const result = await passengerRepository.create(passenger, null);
        expect(result).toEqual(2);
    }, 60000);

    it('should update the passenger with id = 2', async () => {
        const passenger = new Passenger();
        passenger.id = 2
        passenger.passport = 'MP2222222';
        await passengerRepository.update(passenger);
        const result = await passengerRepository.findById(2);
        expect(result[0]).toEqual({
            id: 2,
            fullName: 'Anna Merkul',
            email: 'anna.merkul@bk.ru',
            birthday: '2002-08-16',
            passport: 'MP2222222'
        });
    }, 60000);

    it("should delete a passenger with id = 2", async () => {
        expect(async() => await passengerRepository.delete(2)).not.toThrow();
    }, 60000);

    it("should get all passengers", async () => {
        const result: Passenger[] = await passengerRepository.search(new PassengerFilter(), 0, 10);
        expect(result).toEqual([{
            id: 1,
            fullName: 'Anna Merkul',
            email: 'amerkul@gmail.com',
            birthday: '2002-08-16',
            passport: 'MP7777777'
        }]);
    }, 60000);

    it("should get a passenger with id = 1", async () => {
        const filter = new PassengerFilter();
        filter.fullName = 'anna';
        const result: Passenger[] = await passengerRepository.search(filter, 0, 10);
        expect(result).toEqual([{
                id: 1,
                fullName: 'Anna Merkul',
                email: 'amerkul@gmail.com',
                birthday: '2002-08-16',
                passport: 'MP7777777'
        }]);
    }, 60000);
    
});
