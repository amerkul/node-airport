import CustomError from "./custom-error";

export default class NotFoundException extends CustomError {

    constructor(code: number, message: string) {
        super(code, message);
    }

}