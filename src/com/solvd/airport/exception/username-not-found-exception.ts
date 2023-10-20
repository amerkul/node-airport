import CustomError from "./custom-error";

export default class UsernameNotFoundException extends CustomError {

    constructor(status: number, message: string) {
        super(status, message);
    }

}
