import CustomError from "./custom-error";

export default class EmailAlreadyExistsException extends CustomError {

    constructor(code: number, message: string) {
        super(code, message);
    }
    
}
