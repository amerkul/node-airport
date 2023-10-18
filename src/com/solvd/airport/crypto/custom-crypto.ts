import { CustomHash, CustomSha256Hash } from "./custom-hash";

export function createHash(type: string) : CustomHash {
    switch(type) {
        case 'sha256': return new CustomSha256Hash(); 
        default: throw new Error(`Unexpected hash type ${type}`);
    }
}

