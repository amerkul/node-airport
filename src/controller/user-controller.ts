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
import { UserFilter } from "../model/filter/user-filter";
import CustomError from "../exception/custom-error";
import { UpdateUserDto } from "../dto/update-user-dto";
import NotFoundException from "../exception/not-found-exception";
import { InputValidator } from "./validator/input-validator";
import { Paginator } from "./util/paginator";

class UserController {

    async register(req: Request, res: Response, next: NextFunction) {
        try {
            const userDto: CreateUserDto = req.body;
            InputValidator.validateUserInputOrThrow(userDto);
            if (await userService.findByUsername(userDto.username)) {
                next(new EmailAlreadyExistsException(409, "Username exists"));
            } else {
                const hashedPassword = await bcrypt.hash(userDto.password, 10);
                let user: User = {...userDto};
                user.password = hashedPassword;
                user.role = 'Passenger';
                user.fullName = `${user.firstName} ${user.lastName}`;
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
            InputValidator.validateLoginInputOrThrow(login);
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
            InputValidator.validateUserInputOrThrow(filter);
            const page = isNaN(filter.page) ? 1 : filter.page;
            const size = isNaN(filter.per_page) ? 10 : filter.per_page;
            const users = await userService.retrieveByFilter(
                filter, 
                Paginator.getOffset(page, size), 
                size);
            const totalEntries: number = await userService.retrieveTotalEntries(filter);
            res.send({
                users: users,
                page: page,
                per_page: size,
                total_entries: totalEntries as number || 0,
                total_pages: Paginator.getTotalPages(totalEntries, size)
            });
        } catch(err: any) {
            next(new CustomError(err.code || 500, err.message));
        }
    }

    async getById(req: Request, res: Response, next: NextFunction) {
        try {
            InputValidator.validateIntRouteParamOrThrow(req.params.user_id);
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
            InputValidator.validateUserInputOrThrow(body);
            let user: User = {...body};
            const hashedPassword = await bcrypt.hash(body.password, 10);
            user.password = hashedPassword;
            user.fullName = `${user.firstName} ${user.lastName}`;
            user = await userService.create(user);
            user.password ='';
            res.status(201).send(user);
        } catch(err: any) {
            next(new CustomError(err.code || 500, err.message));
        }
    }

    async update(req: Request, res: Response, next: NextFunction) {
        try {
            InputValidator.validateIntRouteParamOrThrow(req.params.user_id);
            const id = parseInt(req.params.user_id);
            const body: UpdateUserDto = req.body;
            InputValidator.validateUserInputOrThrow(body);
            const user: AuthenticationUserDetails = res.locals.user;
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
            InputValidator.validateIntRouteParamOrThrow(req.params.user_id);
            const id = parseInt(req.params.user_id);
            await userService.delete(id);
            res.sendStatus(204);
        } catch(err: any) {
            next(new CustomError(err.code || 500, err.message));
        }
    }

}

export const userController = new UserController();
