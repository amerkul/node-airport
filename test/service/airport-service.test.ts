import { PGTestContainer } from "../repository/pg-container";
import { airportService } from "../../src/service/airport-service";
import { Airport } from "../../src/model/airport";

describe('Airport service', () => {

    let testContainer = new PGTestContainer();

    beforeAll(async () => {
        await testContainer.init();
    }, 60000);

    afterAll(async () => {
        setTimeout( async () => await testContainer.destroy(), 1000);
    }, 60000);
    
    it('should update airport name', async () => {
        const newData = new Airport();
        newData.name = 'New name'
        expect(async () => await airportService.update(newData, 1)).not.toThrow();
    }, 60000);
    
});