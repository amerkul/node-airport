export default class Claims {
    private claims: Map<string, string | number> = new Map();

    constructor() {}

    setSubject(subject: string) {
        this.put('subject', subject);
    }

    getSubject(): string | undefined | number {
        return this.claims.get('subject');
    }

    put(key: string, value: string | number) {
        this.claims.set(key, value);
    }

}
