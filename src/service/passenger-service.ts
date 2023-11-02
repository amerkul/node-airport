import CustomError from "../exception/custom-error";
import NotFoundException from "../exception/not-found-exception";
import { PassengerFilter } from "../model/filter/passenger-filter";
import { Passenger } from "../model/passenger";
import { passengerRepository } from "../repository/passenger-repository";

class PassengerService {

    async create(passenger: Passenger, userId: number | null): Promise<Passenger> {
        try {
            const passengerId = await passengerRepository.create(passenger, userId);
            passenger.id = passengerId;
            return passenger;
        } catch(err: any) {
            throw new CustomError(500, err.message);
        }
    }

    async retrieveById(id: number): Promise<Passenger> {
        try {
            const passenger = (await passengerRepository.findById(id)).shift();
            if (passenger === undefined) {
                throw new NotFoundException(400, `Passenger with id = ${id} doesn't exist`);
            }
            return passenger;
        } catch(err: any) {
            throw new CustomError(err.code || 500, err.message);
        }
    }

    async update(newData: Passenger, id: number): Promise<Passenger> {
        try {
            newData.id = id;
            await passengerRepository.update(newData);
            return this.retrieveById(id);
        } catch(err: any) {
            throw new CustomError(err.code || 500, err.message);
        }
    }

    async delete(id: number): Promise<void> {
        try {
            await passengerRepository.delete(id);
        } catch (err: any) {
            throw new CustomError(500, err.message);
        }
    }

    async retrieveAll(offset: number, size: number): Promise<Passenger[]> {
        try {
            return await passengerRepository.search(new PassengerFilter(), offset, size);
        } catch(err: any) {
            throw new CustomError(500, err.message);
        }
    }

    async retrieveByFilter(filter: PassengerFilter, offset: number, size: number): Promise<Passenger[]> {
        try {
            return await passengerRepository.search(filter, offset, size);
        } catch(err: any) {
            throw new CustomError(500, err.message);
        }
    }

}

export const passengerService = new PassengerService();
