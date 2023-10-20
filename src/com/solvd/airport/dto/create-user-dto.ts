export default class CreateUserDto {

    public role: string;
    public username: string;
    public password: string;

    constructor(username: string, password: string, role: string) {
        this.role = role;
        this.username = username;
        this.password = password;
    }

}
