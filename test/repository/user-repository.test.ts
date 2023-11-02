import { userRepository } from "../../src/repository/user-repository"
import  User from "../../src/model/user";
import { UserFilter } from "../../src/model/filter/user-filter";
import { PGTestContainer } from "./pg-container";



describe('User repository', () => {

    let testContainer = new PGTestContainer();

    beforeAll(async () => {
        await testContainer.init();
    }, 60000);

    it("should return a user with id = 1", async () => {
        const result: User[] = await userRepository.findById(1);
        expect(result[0]).toEqual({
            id: 1,
            role: 'Passenger',
            firstName: 'Cat',
            lastName: 'Black',
            phone: '+375291111111',
            username: 'cat',
            password: '$2y$10$g5NuZ2nAWAsQOij1e9VRy.2oZKGhC2XH4G66RllU41u52Zr108yCO',
            sex: 'Female',
            active: true,
            country: null,
            street: null,
            zip: null,
            city: null,
            fullName: 'Cat Black',
            email: 'cat@mail.ru',
            birthday: '2005-03-03',
            passport: 'MP5656565'
        });
    }, 60000);

    it("should create a user with id = 4", async () => {
        const user = new User('anna', '$2y$10$10jqAjd7pxuFsVnUSisvbetvCtBnv9bSn9gsjVjcpRjAXE5ZqueB.', 'Passenger');
        user.fullName = 'Anna Merkul';
        user.firstName = 'Anna';
        user.lastName = 'Merkul';
        user.birthday = '2002-08-16';
        user.email = 'anna.merkul@bk.ru';
        user.passport = 'MP1111111';
        const result = await userRepository.create(user);
        expect(result).toEqual(4);
    }, 60000);

    it('should update the user with id = 4', async () => {
        const user = new User('anna', '$2y$10$10jqAjd7pxuFsVnUSisvbetvCtBnv9bSn9gsjVjcpRjAXE5ZqueB.', 'Passenger');
        user.id = 4
        user.email = 'merkul@bk.ru';
        await userRepository.update(user);
        const result = await userRepository.findById(4);
        expect(result[0]).toEqual({
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
            password: '$2y$10$10jqAjd7pxuFsVnUSisvbetvCtBnv9bSn9gsjVjcpRjAXE5ZqueB.',
            sex: null,
            active: true,
            country: null,
            street: null,
            zip: null,
            city: null,
        });
    }, 60000);

    it("should delete a user with id = 4", async () => {
        expect(async() => await userRepository.delete(4)).not.toThrow();
    }, 60000);

    it("should get all users", async () => {
        const result: User[] = await userRepository.search(new UserFilter(), 0, 10);
        expect(result).toEqual([{
            id: 1,
            role: 'Passenger',
            firstName: 'Cat',
            lastName: 'Black',
            phone: '+375291111111',
            username: 'cat',
            password: '$2y$10$g5NuZ2nAWAsQOij1e9VRy.2oZKGhC2XH4G66RllU41u52Zr108yCO',
            sex: 'Female',
            active: true,
            country: null,
            street: null,
            zip: null,
            city: null,
            fullName: 'Cat Black',
            email: 'cat@mail.ru',
            birthday: '2005-03-03',
            passport: 'MP5656565'
        },
        {
            active: true,
            birthday: "2004-03-03",
            city: null,
            country: null,
            email: "dog@mail.ru",
            firstName: "Dog",
            fullName: "Dog White",
            id: 2,
            lastName: "White",
            passport: "MP3433434",
            password: "$2y$10$5VZOdoki./.sSIOOwGsILeurCV97EZnKheOugFJaTqocjxzueZx7a",
            phone: "+375292222222",
            role: "Manager",
            sex: "Male",
            street: null,
            username: "dog",
            zip: null,
        },
        {
            active: true,
            birthday: "2002-08-16",
            city: null,
            country: null,
            email: "amerkul@mail.ru",
            firstName: "Anna",
            fullName: "Anna Merkul",
            id: 3,
            lastName: "Merkul",
            passport: "MP7777777",
            password: "$2y$10$Zfi5kbTrmZqlqOp1itJrM.8iJPLNGSd3Az0WURXXR6BIREDeQU/q2",
            phone: "+375293376183",
            role: "Admin",
            sex: "Female",
            street: null,
            username: "amerkul",
            zip: null,
        }]);
    }, 60000);

    it("should get a passenger with id = 1", async () => {
        const filter = new UserFilter();
        filter.fullName = 'c';
        const result: User[] = await userRepository.search(filter, 0, 10);
        expect(result).toEqual([{
            id: 1,
            role: 'Passenger',
            firstName: 'Cat',
            lastName: 'Black',
            phone: '+375291111111',
            username: 'cat',
            password: '$2y$10$g5NuZ2nAWAsQOij1e9VRy.2oZKGhC2XH4G66RllU41u52Zr108yCO',
            sex: 'Female',
            active: true,
            country: null,
            street: null,
            zip: null,
            city: null,
            fullName: 'Cat Black',
            email: 'cat@mail.ru',
            birthday: '2005-03-03',
            passport: 'MP5656565'
        }]);
    }, 60000);
    
    afterAll(async () => {
        await testContainer.destroy();
    }, 60000);
});

