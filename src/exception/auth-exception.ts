import CustomError from "./custom-error";

export default class AuthenticationException extends CustomError {

    constructor(code: number, message: string) {
        super(code, message);
    }

}
