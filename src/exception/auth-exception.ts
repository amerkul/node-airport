import CustomError from "./custom-error";

export default class AuthenticationException extends CustomError {

    constructor(status: number, message: string) {
        super(status, message);
    }

}
