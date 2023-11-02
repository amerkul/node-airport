import AuthenticationException from "../exception/auth-exception";
import Claims from "./auth-claims";
import Jwt from "./auth-jwt";
import AuthenticationUserDetails from "./auth-user-details";

class AuthenticationUtil {

    private static ROLE: string = 'role';
    private static BEARER: string = 'Bearer ';
    private secret: string = process.env.SECRET as string;
    private validityMillisecond: number = 300000;
    
    createToken(authUser: AuthenticationUserDetails): string {
        const claims = new Claims();
        const issueAt = Date.now();
        const exp = issueAt + this.validityMillisecond;
        claims.setSubject(authUser.username);
        claims.put(AuthenticationUtil.ROLE, "admin");
        return Jwt.builder()
                .setClaims(claims)
                .setIssueAt(issueAt)
                .setExpiration(exp)
                .signWith("HS256", this.secret)
                .compact();
    }

    getUsername(token: string) {
        let claims = Jwt.parser().parseClaims(token);
        return claims.getSubject();
    }

    validateToken(token: string): boolean {
        try {
            const [encodedHeader, encodedBody, encodedSignature] = token.split('.');
            let claims = Jwt.parser().parseClaims(token);
            const expectedSignature = Jwt.builder()
                    .signWith('sha256', this.secret)
                    .getEncodedSignature(encodedHeader, encodedBody);
            if (expectedSignature !== encodedSignature) {
                throw new AuthenticationException(401, 'Invalid token');
            }
            let dateNow = Date.now();
            const expiration = claims.getExpiration();
            return dateNow < Number(expiration);
        } catch (e) {
            throw new AuthenticationException(401, 'Unathorized');
        }

    }

    resolveToken(token: string): string | null {
        if (token.startsWith(AuthenticationUtil.BEARER)) {
            return token.substring(7);
        }
        return null;
    }

}

export const authUtil = new AuthenticationUtil();
