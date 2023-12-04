import CustomError from "../exception/custom-error";
import NotFoundException from "../exception/not-found-exception";
import { Airplane } from "../model/airplane";
import { AirplaneFilter } from "../model/filter/airplane-filter";
import { airplaneRepository } from "../repository/airplane-repository";
import { Validator } from "./validator/service-validator";


class AirplaneService {

    private validator: Validator = new Validator();

    async create(airplane: Airplane, airlineId: number): Promise<Airplane> {
        try {
            this.validator.checkRequiredAirplaneParamsOrThrow(airplane);
            const uniqueAirplanes = await airplaneRepository.findByAirplaneUniqueParams(airplane);
            this.validator.checkUniqueAirplaneParamsOrThrow(uniqueAirplanes, airplane);
            const airplaneId = await airplaneRepository.create(airplane, airlineId);
            airplane.id = airplaneId;
            return airplane;
        } catch (err: any) {
            throw new CustomError(err.code || 500, err.message)
        }
    }

    async update(newData: Airplane, id: number): Promise<Airplane> {
        try {
            newData.id = id;
            const uniqueAirplanes = await airplaneRepository.findByAirplaneUniqueParams(newData);
            this.validator.checkUniqueAirplaneParamsOrThrow(
                uniqueAirplanes.filter(unique => unique.id !== id), newData
            );
            await airplaneRepository.update(newData);
            return this.retrieveById(id);
        } catch(err: any) {
            throw new CustomError(err.code || 500, err.message);
        }
    }

    async delete(id: number): Promise<void> {
        try {
            await airplaneRepository.delete(id);
        } catch (err: any) {
            throw new CustomError(500, err.message);
        }
    }

    async retrieveById(id: number): Promise<Airplane> {
        try {
            const airplane = (await airplaneRepository.findById(id)).shift();
            if (airplane === undefined) {
                throw new NotFoundException(404, `Airplane with id = ${id} doesn't exist`);
            }
            return airplane;
        } catch(err: any) {
            throw new CustomError(err.code || 500, err.message);
        }
    }

    async retrieveTotalEntries(filter: AirplaneFilter): Promise<number> {
        try {
            return await airplaneRepository.findTotalEntries(filter);
        } catch(err: any) {
            throw new CustomError(500, err.message);
        }
    }

    async retrieveByFilter(filter: AirplaneFilter, offset: number, size: number): Promise<Airplane[]> {
        try {
            return await airplaneRepository.search(filter, offset, size);
        } catch(err: any) {
            throw new CustomError(500, err.message);
        }
    }

}

export const airplaneService = new AirplaneService();
