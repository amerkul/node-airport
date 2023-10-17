import { NextFunction, Response, Request } from 'express';
import AuthenticationException from '../exception/auth-exception';
import AuthenticationUserDetails from '../security/auth-user-details';

export function authMiddleware(roles: string[] = []) {
    return (req: Request, res: Response, next: NextFunction) => {
        const user: AuthenticationUserDetails  = res.locals.user;
        if (roles.length && !roles.includes(user.role)) {
            next(new AuthenticationException(401, 'Unauthorized'));
        }
        next();
    };
}
