import AuthenticationException from "../exception/auth-exception";
import { userService } from "../service/user-service"
import AuthenticationUserDetails from "./auth-user-details";

export default class AuthenticationService {

    async loadUserByUsername(username: string): Promise<AuthenticationUserDetails> {
        const user = await userService.findByUsername(username);
        if (user === undefined) {
            throw new AuthenticationException(401, 'Unathorized');
        }
        return new AuthenticationUserDetails(user.username as string, 
            user.password as string, user.role as string, user.id as number);
    }

}

export const authService = new AuthenticationService();
