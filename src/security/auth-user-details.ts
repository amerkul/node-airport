export default class AuthenticationUserDetails {
    public userId: number;
    public username: string;
    public password: string;
    public role: string;

    constructor(username: string, password: string, role: string, userId: number) {
        this.username = username;
        this.password = password;
        this.role = role;
        this.userId = userId;
    }

}
