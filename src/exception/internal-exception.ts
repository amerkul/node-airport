import CustomError from "./custom-error";

export default class InternalException extends CustomError {

    constructor(code: number, message: string) {
        super(code, message);
    }
    
}