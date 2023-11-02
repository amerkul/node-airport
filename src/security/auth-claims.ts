export default class Claims {
    private claims: Map<string, string | number> = new Map();

    constructor() {}

    setSubject(subject: string) {
        this.put('subject', subject);
    }

    getSubject(): string {
        return this.claims.get('subject') as string;
    }

    getExpiration(): string | number | undefined {
        return this.claims.get('exp');
    }

    getClaims(): Map<string, string | number> {
        return this.claims;
    }

    put(key: string, value: string | number) {
        this.claims.set(key, value);
    }

}
