export default class CustomError extends Error {
    
    private _status: number;

    constructor(status: number, message: string) {
        super(message);
        this._status = status;
    }

    get status() {
        return this._status;
    }

}
