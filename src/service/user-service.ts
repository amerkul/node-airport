import CustomError from "../exception/custom-error";
import User from "../model/user";
import { userRepository } from "../repository/user-repository";
import NotFoundException from "../exception/not-found-exception";
import { UserFilter } from "../model/filter/user-filter";


class UserService {

    async findByUsername(username: string): Promise<User | undefined> {
        try {
            return (await userRepository.findByUsername(username)).shift();
        } catch(err: any) {
            throw new CustomError(500, err.message);
        }
    }

    async create(user: User): Promise<User> {
        try {
            const userId = await userRepository.create(user);
            user.id = userId;
            return user;
        } catch(err: any) {
            throw new CustomError(500, err.message);
        }
    }

    async retrieveById(id: number): Promise<User> {
        try {
            const user = (await userRepository.findById(id)).shift();
            if (user === undefined) {
                throw new NotFoundException(400, `User with id = ${id} doesn't exist`);
            }
            return user;
        } catch(err: any) {
            throw new CustomError(err.code || 500, err.message);
        }
    }

    async update(newData: User, id: number): Promise<User> {
        try {
            newData.id = id;
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

    async retrieveAll(offset: number, size: number): Promise<User[]> {
        try {
            return await userRepository.search(new UserFilter(), offset, size);
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
