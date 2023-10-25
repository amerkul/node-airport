import { NextFunction, Request, Response } from "express";
import LoginDto from "../dto/login-dto";
import { authService } from "../security/auth-service";
import AuthenticationUserDetails from "../security/auth-user-details";
import * as bcrypt from 'bcrypt';
import AuthenticatedUserDto from "../dto/auth-user-dto";
import AuthenticationException from "../exception/auth-exception";
import User from "../model/user";
import { userService } from "../service/user-service";
import EmailAlreadyExistsException from "../exception/exist-exception";
import CreateUserDto from "../dto/create-user-dto";
import {authUtil} from "../security/auth-util";
import InternalException from "../exception/internal-exception";

class UserController {

    async register(req: Request, res: Response, next: NextFunction) {
        try {
            const userDto: CreateUserDto = req.body;
            if (await authService.loadUserByUsername(userDto.username)) {
                next(new EmailAlreadyExistsException(409, "Email exists"));
            } else {
                const hashedPassword = await bcrypt.hash(userDto.password, 10);
                const user = await userService.create(new User(userDto.username, hashedPassword, userDto.role));
                user.password = "";
                res.send(user);
            }
        } catch(e) {
            next(new InternalException(500, 'Server exception'));
        }
    }

    async login(req: Request, res: Response, next: NextFunction) {
        try {
            const login: LoginDto = req.body;
            const authUser: AuthenticationUserDetails = await authService.loadUserByUsername(login.username);
            if (authUser) {
                const authentication = await bcrypt.compare(login.password, authUser.password);
                if (authentication) {
                    const token = authUtil.createToken(authUser);
                    res.send(new AuthenticatedUserDto(authUser.username, token));
                } else {
                    next(new AuthenticationException(401, "Unauthorized"));
                }
            } else {
                next(new AuthenticationException(401, "Unauthorized"));
            }
        } catch (e) {
            next(new InternalException(500, 'Server exception'));
        }
    }

}

export const userController = new UserController();
