import { Sex } from './enum/sex';
export default class User {

    public id: number | undefined;
    public username: string;
    public password: string;
    public role: string;
    public firstName: string | undefined;
    public lastName: string | undefined;
    public fullName: string | undefined;
    public email: string | undefined;
    public birthday: string | undefined | null;
    public passport: string | undefined;
    public active: boolean | undefined;
    public phone: string | undefined | null;
    public sex: Sex | undefined | null;
    public country: string | undefined | null;
    public city: string | undefined | null;
    public zip: number | undefined | null;
    public street: string | undefined | null;
    

    constructor(username: string, password: string, role: string) {
        this.username = username;
        this.password = password;
        this.role = role;
    }

}