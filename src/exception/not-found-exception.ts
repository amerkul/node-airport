import CustomError from "./custom-error";

export default class NotFoundException extends CustomError {

    constructor(status: number, message: string) {
        super(status, message);
    }

}