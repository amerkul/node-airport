import { userService } from "../service/user-service"
import AuthenticationUserDetails from "./auth-user-details";

export default class AuthenticationService {

    async loadUserByUsername(username: String): Promise<AuthenticationUserDetails> {
        const user = await userService.findByUsername(username);
        return new AuthenticationUserDetails(user.username, user.password, user.role);
    }

}

export const authService = new AuthenticationService();
