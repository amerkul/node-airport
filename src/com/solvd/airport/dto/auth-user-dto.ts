export default class AuthenticatedUserDto {
    public fullName: string;
    public token: string;

    constructor(fullName: string, token: string) {
        this.fullName = fullName;
        this.token = token;
    }
    
}