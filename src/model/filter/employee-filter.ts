export class EmployeeFilter {
    public full_name: string | undefined;
    public passport: string | undefined;
    public active: boolean | undefined;
    public department: string | undefined;
    public page: number;
    public per_page: number;
}
