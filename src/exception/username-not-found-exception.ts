import CustomError from "./custom-error";

export default class UsernameNotFoundException extends CustomError {

    constructor(code: number, message: string) {
        super(code, message);
    }

}
