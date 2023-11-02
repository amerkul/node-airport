import CustomError from "../exception/custom-error";
import NotFoundException from "../exception/not-found-exception";
import { Airline } from "../model/airline";
import { AirlineFilter } from "../model/filter/airline-filter";
import { airlineRepository } from "../repository/airline-repository";

class AirlineService {

    async create(airline: Airline, airportId: number): Promise<Airline> {
        try {
            const airlineId = await airlineRepository.create(airline, airportId);
            airline.id = airlineId;
            return airline;
        } catch (err: any) {
            throw new CustomError(500, err.message)
        }
    }

    async update(newData: Airline, id: number): Promise<Airline> {
        try {
            newData.id = id;
            await airlineRepository.update(newData);
            return this.retrieveById(id);
        } catch(err: any) {
            throw new CustomError(err.code || 500, err.message);
        }
    }

    async delete(id: number): Promise<void> {
        try {
            await airlineRepository.delete(id);
        } catch (err: any) {
            throw new CustomError(500, err.message);
        }
    }

    async retrieveById(id: number): Promise<Airline> {
        try {
            const airline = (await airlineRepository.findById(id)).shift();
            if (airline === undefined) {
                throw new NotFoundException(404, `Airline with id = ${id} doesn't exist`);
            }
            return airline;
        } catch(err: any) {
            throw new CustomError(err.code || 500, err.message);
        }
    }

    async retrieveAll(offset: number, size: number): Promise<Airline[]> {
        try {
            return await airlineRepository.search(new AirlineFilter(), offset, size);
        } catch(err: any) {
            throw new CustomError(500, err.message);
        }
    }

    async retrieveByFilter(filter: AirlineFilter, offset: number, size: number): Promise<Airline[]> {
        try {
            return await airlineRepository.search(filter, offset, size);
        } catch(err: any) {
            throw new CustomError(500, err.message);
        }
    }

}

export const airlineService = new AirlineService();
