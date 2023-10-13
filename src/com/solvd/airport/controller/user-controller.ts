import { NextFunction, Request, Response } from "express";
import LoginDto from "../dto/login-dto";
import AuthenticationService, { authService } from "../security/auth-service";
import AuthenticationUserDetails from "../security/auth-user-details";
import * as bcrypt from 'bcrypt';
import AuthenticationUtil, { authUtil } from "../security/auth-util";
import AuthenticatedUserDto from "../dto/auth-user-dto";
import UsernameNotFoundException from "../exception/username-not-found-exception";
import AuthenticationException from "../exception/auth-exception";
import User from "../model/user";
import UserService, { userService } from "../service/user-service";
import EmailAlreadyExistsException from "../exception/exist-exception";
import CreateUserDto from "../dto/create-user-dto";

export default class UserController {

    private authService: AuthenticationService;
    private userService: UserService;
    private authUtil: AuthenticationUtil;

    constructor(authService: AuthenticationService, 
                authUtil: AuthenticationUtil,
                userService: UserService) {
        this.authService = authService;
        this.authUtil = authUtil;
        this.userService = userService;
    }

    async register(req: Request, res: Response, next: NextFunction) {
        const userDto: CreateUserDto = req.body;
        if (await this.authService.loadUserByUsername(userDto.username)) {
            next(new EmailAlreadyExistsException(409, "Email exists"));
        } else {
            const hashedPassword = await bcrypt.hash(userDto.password, 10);
            const user = await this.userService.create(new User(userDto.username, hashedPassword));
            user.password = "";
            res.send(user);
        }
    }

    async login(req: Request, res: Response, next: NextFunction) {
        const login: LoginDto = req.body;
        const authUser: AuthenticationUserDetails = await this.authService.loadUserByUsername(login.username);
        if (authUser) {
            const authentication = await bcrypt.compare(login.password, authUser.password);
            if (authentication) {
                const token = this.authUtil.createToken(authUser);
                res.send(new AuthenticatedUserDto(authUser.username, token));
            } else {
                next(new AuthenticationException(401, "Unauthorized"));
            }
        } else {
            next(new UsernameNotFoundException(404, "Not found"));
        }
        res.send('this.posts');
    }

}

export const userController = new UserController(authService, authUtil, userService);
