import User from "../model/user";

export default class UserService {

    constructor() {}

    async findByUsername(username: String): Promise<User> {
        return new User('anna', 'password');
    }

    async create(newUser: User) {
        return new User('anna', 'password');
    }

}

export const userService = new UserService();
