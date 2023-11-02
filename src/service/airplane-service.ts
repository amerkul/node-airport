import CustomError from "../exception/custom-error";
import NotFoundException from "../exception/not-found-exception";
import { Airplane } from "../model/airplane";
import { AirplaneFilter } from "../model/filter/airplane-filter";
import { airplaneRepository } from "../repository/airplane-repository";


class AirplaneService {

    async create(airplane: Airplane, airlineId: number): Promise<Airplane> {
        try {
            const airplaneId = await airplaneRepository.create(airplane, airlineId);
            airplane.id = airplaneId;
            return airplane;
        } catch (err: any) {
            throw new CustomError(500, err.message)
        }
    }

    async update(newData: Airplane, id: number): Promise<Airplane> {
        try {
            newData.id = id;
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

    async retrieveAll(offset: number, size: number): Promise<Airplane[]> {
        try {
            return await airplaneRepository.search(new AirplaneFilter(), offset, size);
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
