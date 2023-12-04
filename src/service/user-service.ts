import CustomError from "../exception/custom-error";
import User from "../model/user";
import { userRepository } from "../repository/user-repository";
import NotFoundException from "../exception/not-found-exception";
import { UserFilter } from "../model/filter/user-filter";
import { Validator } from "./validator/service-validator";


class UserService {

    private validator: Validator = new Validator();

    async findByUsername(username: string): Promise<User | undefined> {
        try {
            return (await userRepository.findByUsername(username)).shift();
        } catch(err: any) {
            throw new CustomError(500, err.message);
        }
    }

    async create(user: User): Promise<User> {
        try {
            this.validator.checkRequiredUserParamsOrThrow(user);
            const uniqueUsers = await userRepository.findByUniqueParams(user);
            this.validator.checkUniqueUserParamsOrThrow(uniqueUsers, user);
            const userId = await userRepository.create(user);
            user.id = userId;
            return user;
        } catch(err: any) {
            throw new CustomError(err.code || 500, err.message);
        }
    }

    async retrieveById(id: number): Promise<User> {
        try {
            const user = (await userRepository.findById(id)).shift();
            if (user === undefined) {
                throw new NotFoundException(404, `User with id = ${id} doesn't exist`);
            }
            return user;
        } catch(err: any) {
            throw new CustomError(err.code || 500, err.message);
        }
    }

    async update(newData: User, id: number): Promise<User> {
        try {
            newData.id = id;
            const uniqueUsers = await userRepository.findByUniqueParams(newData);
            this.validator.checkUniqueUserParamsOrThrow(
                uniqueUsers.filter(unique => unique.id !== id), newData
            );
            const user = uniqueUsers.filter(unique => unique.id === id).shift();
            if (newData.firstName !== undefined && newData.lastName !== undefined) {
                newData.fullName = `${newData.firstName} ${newData.lastName}`;
            } else if (newData.firstName !== undefined && user !== undefined) {
                newData.fullName = `${newData.firstName} ${user.lastName}`;
            } else if (newData.lastName !== undefined && user !== undefined) {
                newData.fullName = `${user.firstName} ${newData.lastName}`;
            }
            await userRepository.update(newData);
            return this.retrieveById(id);
        } catch(err: any) {
            throw new CustomError(err.code || 500, err.message);
        }
    }

    async delete(id: number): Promise<void> {
        try {
            await userRepository.delete(id);
        } catch (err: any) {
            throw new CustomError(500, err.message);
        }
    }

    async retrieveTotalEntries(filter: UserFilter): Promise<number> {
        try {
            return await userRepository.findTotalEntries(filter);
        } catch(err: any) {
            throw new CustomError(500, err.message);
        }
    }

    async retrieveByFilter(filter: UserFilter, offset: number, size: number): Promise<User[]> {
        try {
            return await userRepository.search(filter, offset, size);
        } catch(err: any) {
            throw new CustomError(500, err.message);
        }
    }

}

export const userService = new UserService();
