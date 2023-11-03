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
import InternalException from "../exception/argument-exception";
import { UserFilter } from "../model/filter/user-filter";
import CustomError from "../exception/custom-error";
import { UpdateUserDto } from "../dto/update-user-dto";
import NotFoundException from "../exception/not-found-exception";

class UserController {

    async register(req: Request, res: Response, next: NextFunction) {
        try {
            const userDto: CreateUserDto = req.body;
            if (await authService.loadUserByUsername(userDto.username)) {
                next(new EmailAlreadyExistsException(409, "Email exists"));
            } else {
                const hashedPassword = await bcrypt.hash(userDto.password, 10);
                let user: User = {...userDto};
                user.password = hashedPassword;
                user.role = 'Passenger';
                user = await userService.create(user);
                user.password = "";
                res.status(201).send(user);
            }
        } catch(e: any) {
            next(new CustomError(e.code || 500, e.message));
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
        } catch (e: any) {
            next(new CustomError(e.code || 500, e.message));
        }
    }

    async getAll(req: Request, res: Response, next: NextFunction) {
        try {
            const filter: UserFilter = JSON.parse(JSON.stringify(req.query));
            res.send(await userService.retrieveByFilter(filter, ((filter.page - 1) * filter.per_page)  || 0, filter.per_page || 10));
        } catch(err: any) {
            next(new CustomError(err.code || 500, err.message));
        }
    }

    async getById(req: Request, res: Response, next: NextFunction) {
        try {
            const user: AuthenticationUserDetails = res.locals.user;
            const id = parseInt(req.params.user_id);
            if (user.role === 'Passenger' && user.userId !== id) {
                throw new NotFoundException(404, 'Not found');
            }
            res.send(await userService.retrieveById(id));
        } catch(err: any) {
            next(new CustomError(err.code || 500, err.message));
        }
    }

    async create(req: Request, res: Response, next: NextFunction) {
        try {
            const body: CreateUserDto = req.body;
            let user: User = {...body};
            const hashedPassword = await bcrypt.hash(body.password, 10);
            user.password = hashedPassword;
            user.role = 'Passenger';
            user = await userService.create(body);
            user.password ='';
            res.status(201).send(user);
        } catch(err: any) {
            next(new CustomError(err.code || 500, err.message));
        }
    }

    async update(req: Request, res: Response, next: NextFunction) {
        try {
            const body: UpdateUserDto = req.body;
            const user: AuthenticationUserDetails = res.locals.user;
            const id = parseInt(req.params.user_id);
            if (user.role === 'Passenger' && user.userId !== id) {
                throw new NotFoundException(404, 'Not found');
            }
            const newData: User = {...body};
            res.send(await userService.update(newData, id));
        } catch(err: any) {
            next(new CustomError(err.code || 500, err.message));
        }
    }

    async deleteById(req: Request, res: Response, next: NextFunction) {
        try {
            const id = parseInt(req.params.user_id);
            await userService.delete(id);
            res.sendStatus(204);
        } catch(err: any) {
            next(new CustomError(err.code || 500, err.message));
        }
    }

}

export const userController = new UserController();
