import User from "../model/user";

class UserService {

    async findByUsername(username: String): Promise<User> {
        return new User('anna', '$2b$10$BdOpsXGQ/6rMCB8z67uKBux04UPTG1NH4h0ABDYZ94ffvhokDsTA2', 'admin');
    }

    async create(newUser: User) {
        return new User('anna', '$2b$10$BdOpsXGQ/6rMCB8z67uKBux04UPTG1NH4h0ABDYZ94ffvhokDsTA2', 'admin');
    }

}

export const userService = new UserService();
