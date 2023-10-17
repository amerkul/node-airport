import CustomError from "./custom-error";

export default class InternalException extends CustomError {

    constructor(status: number, message: string) {
        super(status, message);
    }
    
}