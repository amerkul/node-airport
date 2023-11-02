import { Sex } from "../model/enum/sex";

export class CreateEmployeeDto {
    public department: string;
    public salary: number | undefined;
    public username: string;
    public password: string;
    public firstName: string | undefined;
    public lastName: string | undefined;
    public fullName: string | undefined;
    public email: string | undefined;
    public birthday: string | undefined | null;
    public passport: string | undefined;
    public phone: string | undefined | null;
    public sex: Sex | undefined | null;
    public country: string | undefined | null;
    public city: string | undefined | null;
    public zip: number | undefined | null;
    public street: string | undefined | null;
}
