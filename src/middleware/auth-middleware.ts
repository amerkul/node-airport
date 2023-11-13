import { NextFunction, Response, Request } from 'express';
import AuthenticationException from '../exception/auth-exception';
import { authUtil } from '../security/auth-util';
import { authService } from '../security/auth-service';

 
export async function authMiddleware(request: Request, response: Response, next: NextFunction) {
  const authHeader = request.headers.authorization;
  if (authHeader) {
    const token = authUtil.resolveToken(authHeader);
    if (token) {
        const username = authUtil.getUsername(token);
        const user = await authService.loadUserByUsername(username);
        if (!!user && authUtil.validateToken(token)) {
          response.locals.user = user;
          next();
        } else {
          next(new AuthenticationException(401, 'Unauthorized'));
        }
    } else {
        next(new AuthenticationException(401, 'Unauthorized'));
    }
  } else {
    next(new AuthenticationException(401, 'Unauthorized'));
  }
}
