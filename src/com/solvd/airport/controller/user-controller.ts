import { NextFunction, Request, Response } from "express";
import LoginDto from "../dto/login-dto";
import { authService } from "../security/auth-service";
import AuthenticationUserDetails from "../security/auth-user-details";
import * as bcrypt from 'bcrypt';
import AuthenticatedUserDto from "../dto/auth-user-dto";
import UsernameNotFoundException from "../exception/username-not-found-exception";
import AuthenticationException from "../exception/auth-exception";
import User from "../model/user";
import { userService } from "../service/user-service";
import EmailAlreadyExistsException from "../exception/exist-exception";
import CreateUserDto from "../dto/create-user-dto";
import {authUtil} from "../security/auth-util";

class UserController {

    async register(req: Request, res: Response, next: NextFunction) {
        const userDto: CreateUserDto = req.body;
        if (await authService.loadUserByUsername(userDto.username)) {
            next(new EmailAlreadyExistsException(409, "Email exists"));
        } else {
            const hashedPassword = await bcrypt.hash(userDto.password, 10);
            const user = await userService.create(new User(userDto.username, hashedPassword, userDto.role));
            user.password = "";
            res.send(user);
        }
    }

    async login(req: Request, res: Response, next: NextFunction) {
        const login: LoginDto = req.body;
        console.log(login);
        const authUser: AuthenticationUserDetails = await authService.loadUserByUsername(login.username);
        if (authUser) {
            console.log(await bcrypt.hash(login.password, 10))
            const authentication = await bcrypt.compare(login.password, authUser.password);
            if (authentication) {
                const token = authUtil.createToken(authUser);
                res.send(new AuthenticatedUserDto(authUser.username, token));
            } else {
                next(new AuthenticationException(401, "Unauthorized"));
            }
        } else {
            next(new UsernameNotFoundException(404, "Not found"));
        }
    }

}

export const userController = new UserController();