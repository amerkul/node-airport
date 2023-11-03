import CustomError from "./custom-error";

export default class InvalidArgumentException extends CustomError {

    constructor(code: number, message: string) {
        super(code, message);
    }
    
}