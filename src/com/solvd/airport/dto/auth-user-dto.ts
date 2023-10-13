export default class AuthenticatedUserDto {
    private _fullName: string;
    private _token: string;

    constructor(fullName: string, token: string) {
        this._fullName = fullName;
        this._token = token;
    }

    get fullName() {
        return this._fullName;
    }

    set fullName(fullName: string) {
        this._fullName = fullName;
    }

    get token() {
        return this._token;
    }

    set token(token: string) {
        this._token = token;
    }
    
}