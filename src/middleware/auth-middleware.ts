import { NextFunction, Response, Request } from 'express';
import AuthenticationException from '../exception/auth-exception';
import { authUtil } from '../security/auth-util';
import { authService } from '../security/auth-service';

 
export async function authMiddleware(request: Request, response: Response, next: NextFunction) {
  const authHeader = request.headers.authorization;
  if (authHeader) {
    let token = authUtil.resolveToken(authHeader)
    if (token) {
        let username = authUtil.getUsername(token);
        let user = await authService.loadUserByUsername(username);
        if (!!user && authUtil.validateToken(authHeader)) {
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
