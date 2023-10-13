import AuthenticationUserDetails from "./auth-user-details";

export default class AuthenticationUtil {

    private static ROLE: string = "role";
    private static AUTHORISATION: string = "Authorization";
    private static BEARER: string = "Bearer ";
    private secret: string = "secret";
    private validityMillisecond: number = 300;
    
    createToken(authUser: AuthenticationUserDetails) {
        return '';
    }

}

export const authUtil: AuthenticationUtil = new AuthenticationUtil();