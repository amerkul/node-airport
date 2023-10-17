import Claims from './auth-claims';
import * as crypto from 'crypto';

export default class Jwt {

    static builder(): JwtBuilder {
        return new JwtBuilder();
    }

    static parser(): JwtParser {
        return new JwtParser();
    }

}

class JwtParser {

    private secret: string | null = null;

    setSigningKey(secret: string) {
        this.secret = secret;
    }

    parseClaims(token: string): Claims {
        const [_, encodedBody] = token.split('.');
        const str = Buffer.from(encodedBody, 'base64').toString();
        const body = JSON.parse(str);
        let claims = new Claims();
        for (let key in body) {
            claims.put(key, body[key]);
        }
        return claims;
    }

}

class JwtBuilder {

    private claims: Claims = new Claims();
    private signatureAlgorithm: string | null = null;
    private secret: string | null = null;

    setClaims(claims: Claims): JwtBuilder {
        this.claims = claims;
        return this;
    }

    setIssueAt(issueAt: number): JwtBuilder {
        this.claims.put('iss', issueAt.toString());
        return this;
    }

    setExpiration(expirationAt: number): JwtBuilder {
        this.claims.put('exp', expirationAt.toString());
        return this;
    }

    signWith(algorithm: any, secret: string): JwtBuilder {
        this.signatureAlgorithm = algorithm;
        this.secret = secret;
        return this;
    }

    compact(): string {
        const header = this.getEncodedHeader();
        const payload = this.getEncodedPayload();
        let signature = this.getEncodedSignature(header, payload);
        return `${header}.${payload}.${signature}`;
    }

    getEncodedHeader() {
        return Buffer.from(JSON.stringify({'alg': this.signatureAlgorithm, 'typ': 'JWT'})).toString('base64');

    }

    getEncodedPayload() {
        return Buffer.from(JSON.stringify(Object.fromEntries(this.claims.getClaims()))).toString('base64');
    }

    getEncodedSignature(encodedHeader: string, encodedPayload: string): string {
        const hash = crypto.createHash('sha256');
        return hash.update(`${encodedHeader}.${encodedPayload}${this.secret}`).digest('hex');
    }

}
