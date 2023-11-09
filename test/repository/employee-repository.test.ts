import { employeeRepository } from "../../src/repository/employee-repository";
import { Employee } from "../../src/model/employee";
import { EmployeeFilter } from "../../src/model/filter/employee-filter";
import { PGTestContainer } from "./pg-container";
import User from "../../src/model/user";

describe('Employee repository', () => {

    let testContainer = new PGTestContainer();

    beforeAll(async () => {
        await testContainer.init();
    }, 60000);

    it("should return a employee with id = 2", async () => {
        const result: Employee[] = await employeeRepository.findById(2);
        expect(result[0]).toEqual({
            user: {
                id: 2,
                role: 'Manager',
                firstName: 'Dog',
                lastName: 'White',
                phone: '+375292222222',
                username: 'dog',
                password: undefined,
                sex: 'Male',
                active: true,
                country: null,
                street: null,
                zip: null,
                city: null,
                fullName: 'Dog White',
                email: 'dog@mail.ru',
                birthday: '2004-03-03',
                passport: 'MP3433434',
            },
            department: 'Test automation',
            salary: 700
        });
    }, 60000);

    it("should create an employee with id = 4", async () => {
        const employee = new Employee();
        const user = new User('anna', '$2y$10$10jqAjd7pxuFsVnUSisvbetvCtBnv9bSn9gsjVjcpRjAXE5ZqueB.', 'Passenger');
        user.fullName = 'Anna Merkul';
        user.firstName = 'Anna';
        user.lastName = 'Merkul';
        user.birthday = '2002-08-16';
        user.email = 'anna.merkul@bk.ru';
        user.passport = 'MP1111111';
        user.fullName = 'Anna Merkul';
        user.firstName = 'Anna';
        user.lastName = 'Merkul';
        user.birthday = '2002-08-16';
        user.email = 'anna.merkul@bk.ru';
        user.passport = 'MP1111111';
        user.role = "Admin"
        employee.user = user;
        employee.department = 'CEO';
        employee.salary = 444;
        const result = await employeeRepository.create(employee);
        expect(result).toEqual(4);
    }, 60000);

    it('should update the user with id = 4', async () => {
        const employee = new Employee();
        const user = new User('anna', '$2y$10$10jqAjd7pxuFsVnUSisvbetvCtBnv9bSn9gsjVjcpRjAXE5ZqueB.', 'Passenger');
        user.id = 4;
        employee.user = user;
        employee.user.email = 'merkul@bk.ru';
        employee.department = 'QA'
        await employeeRepository.update(employee);
        const result = await employeeRepository.findById(4);
        expect(result[0]).toEqual({
            user: {
            id: 4,
            firstName: 'Anna',
            lastName: 'Merkul',
            fullName: 'Anna Merkul',
            email: 'merkul@bk.ru',
            birthday: '2002-08-16',
            passport: 'MP1111111',
            role: 'Passenger',
            phone: null,
            username: 'anna',
            password: undefined,
            sex: null,
            active: true,
            country: null,
            street: null,
            zip: null,
            city: null,
            },
            department: 'QA',
            salary: 444
        });
    }, 60000);

    it("should delete an employee with id = 4", async () => {
        expect(async() => await employeeRepository.delete(4)).not.toThrow();
    }, 60000);

    it("should get all employees", async () => {
        const result: Employee[] = await employeeRepository.search(new EmployeeFilter(), 0, 10);
        expect(result).toEqual([
            {
                user: {
                  id: 3,
                  role: 'Admin',
                  username: 'amerkul',
                  password: undefined,
                  firstName: 'Anna',
                  lastName: 'Merkul',
                  email: 'amerkul@mail.ru',
                  birthday: '2002-08-16',
                  passport: 'MP7777777',
                  fullName: 'Anna Merkul',
                  active: true,
                  phone: '+375293376183',
                  sex: 'Female',
                  country: null,
                  city: null,
                  zip: null,
                  street: null
                },
                department: 'CEO',
                salary: 1000
              },
              {
                user: {
                  id: 2,
                  role: 'Manager',
                  username: 'dog',
                  password: undefined,
                  firstName: 'Dog',
                  lastName: 'White',
                  email: 'dog@mail.ru',
                  birthday: '2004-03-03',
                  passport: 'MP3433434',
                  fullName: 'Dog White',
                  active: true,
                  phone: '+375292222222',
                  sex: 'Male',
                  country: null,
                  city: null,
                  zip: null,
                  street: null
                },
                department: 'Test automation',
                salary: 700
              },
        ]);
    }, 60000);

    it("should get employees with id = 3", async () => {
        const filter = new EmployeeFilter();
        filter.full_name = 'ann';
        const result: Employee[] = await employeeRepository.search(filter, 0, 10);
        expect(result).toEqual([
            {
                user: {
                  id: 3,
                  role: 'Admin',
                  username: 'amerkul',
                  password: undefined,
                  firstName: 'Anna',
                  lastName: 'Merkul',
                  email: 'amerkul@mail.ru',
                  birthday: '2002-08-16',
                  passport: 'MP7777777',
                  fullName: 'Anna Merkul',
                  active: true,
                  phone: '+375293376183',
                  sex: 'Female',
                  country: null,
                  city: null,
                  zip: null,
                  street: null
                },
                department: 'CEO',
                salary: 1000
              },
        ]);
    }, 60000);

    afterAll(async () => {
        await testContainer.destroy();
    }, 60000);
});

