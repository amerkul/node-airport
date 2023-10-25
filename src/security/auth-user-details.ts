export default class AuthenticationUserDetails {
    
    public username: string;
    public password: string;
    public role: string;

    constructor(username: string, password: string, role: string) {
        this.username = username;
        this.password = password;
        this.role = role;
    }

}
