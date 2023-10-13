import CustomError from "./custom-error";

export default class EmailAlreadyExistsException extends CustomError {

    constructor(status: number, message: string) {
        super(status, message);
    }
    
}