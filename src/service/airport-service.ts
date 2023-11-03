import { Airport } from "../model/airport";
import { airportRepository } from "../repository/airport-repository"; 
import CustomError from "../exception/custom-error";
import NotFoundException from "../exception/not-found-exception";
import { AirportFilter } from "../model/filter/airport-filter";
import { Validator } from "./validator/service-validator";

class AirportService {

    private validator: Validator = new Validator();

    async create(airport: Airport): Promise<Airport> {
        try {
            this.validator.checkRequiredAirportParamsOrThrow(airport);
            const uniqueAirport = await airportRepository.findByUniqueParameters(airport);
            this.validator.checkUniqueAirportParamsOrThrow(uniqueAirport, airport);
            const airportId = await airportRepository.createAirport(airport);
            airport.id = airportId;
            return airport;
        } catch (err: any) {
            throw new CustomError(err.code || 500, err.message);
        }
    }

    async update(newData: Airport, id: number): Promise<Airport> {
        try {
            newData.id = id;
            const uniqueAirports = await airportRepository.findByUniqueParameters(newData);
            this.validator.checkUniqueAirportParamsOrThrow(
                uniqueAirports.filter(unique => unique.id !== id), newData
            );
            await airportRepository.update(newData);
            return this.retrieveById(id);
        } catch(err: any) {
            throw new CustomError(err.code || 500, err.message);
        }
    }

    async delete(id: number): Promise<void> {
        try {
            await airportRepository.delete(id);
        } catch (err: any) {
            throw new CustomError(500, err.message);
        }
    }

    async retrieveById(id: number): Promise<Airport> {
        try {
            const airport = (await airportRepository.findById(id)).shift();
            if (airport === undefined) {
                throw new NotFoundException(404, `Airport with id = ${id} doesn't exist`);
            }
            return airport;
        } catch(err: any) {
            throw new CustomError(err.code || 500, err.message);
        }
    }

    async retrieveByFilter(filter: AirportFilter, offset: number, size: number): Promise<Airport[]> {
        try {
            return await airportRepository.search(filter, offset, size);
        } catch(err: any) {
            throw new CustomError(500, err.message);
        }
    }

}

export const airportService = new AirportService();
