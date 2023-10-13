import UserService, { userService } from "../service/user-service"
import AuthenticationUserDetails from "./auth-user-details";

export default class AuthenticationService {

    private userService : UserService;

    constructor(userService: UserService) {
        this.userService = userService;
    }

    async loadUserByUsername(username: String): Promise<AuthenticationUserDetails> {
        const user = await this.userService.findByUsername(username);
        return new AuthenticationUserDetails(user.username, user.password);
    }

}

export const authService = new AuthenticationService(userService);