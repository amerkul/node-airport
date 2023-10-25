export interface CustomHash {
    update(input: string): CustomHash;
    digest(type: string): string;
}

export class CustomSha256Hash implements CustomHash {

    private static H = [
        0x6a09e667, 
        0xbb67ae85, 
        0x3c6ef372, 
        0xa54ff53a, 
        0x510e527f, 
        0x9b05688c, 
        0x1f83d9ab, 
        0x5be0cd19
    ];
    
    private static K = [
        0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 
        0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5, 
        0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3, 
        0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174, 
        0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc, 
        0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da, 
        0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 
        0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967, 
        0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13, 
        0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85, 
        0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 
        0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070, 
        0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 
        0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3, 
        0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208, 
        0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2
    ];

    private hashed = new Uint32Array(CustomSha256Hash.H);

    update(input: string): CustomHash {
        const msgBuffer = new TextEncoder().encode(input);  
        const arrBuffer = new ArrayBuffer(((input.length / 64 | 0) + 1) * 64);
        const bytes = new Uint8Array(arrBuffer);
        const stringView = new DataView(arrBuffer);
        const words = new Int32Array(arrBuffer);

        msgBuffer.forEach((code, i) => bytes[i] = code);
        bytes[input.length] = 0x80; 
        stringView.setInt32(bytes.length - 4, input.length * 8);
        
        const buf32 = new Array(64);
        const hTemp = new Int32Array(8);

        for (let i = 0; i < words.length; i+=16) {
            let j = 0;
            while (j < 16) { 
                buf32[j] = stringView.getInt32((i + (j++)) * 4) 
            }
            while (j < 64) { buf32[j] = this.packChunk(j++, buf32) }
            hTemp.set(this.hashed);
            this.hashValues(0, hTemp, buf32);
            this.sumValues(0, hTemp);
        } 
        return this;
    }

    digest(encoding: string): string {
        switch(encoding) {
            case 'hex': {
                const result = [];
                for (let i = 0; i < 8; i++) { 
                    result[i] = this.hashed[i].toString(16).padStart(8, "0") 
                };
                return result.join("");
            }
            default: throw new Error(`Unexpected value: ${encoding}`);
        }
    }

    packChunk(i: number, b: Array<number>): number {
        return this.omega1(b[i - 2]) + b[i - 7] + this.omega0(b[i - 15]) + b[i - 16];
    };


    omega0(n: number): number {
        return (((n >>> 7) | (n << (32 - 7))) ^ ((n >>> 18) | (n << (32 - 18))) ^ (n >>> 3));
    }

    omega1(n: number): number {
        return (((n >>> 17) | (n << (32 - 17))) ^ ((n >>> 19) | (n << (32 - 19))) ^ (n >>> 10));
    }

    hashValues(i: number, t: Int32Array, b: Array<number>) {
        while (i < 64) {
            let temp1 = t[7] + this.sigma1(t[4]) + this.choice(t[4], t[5], t[6]) + CustomSha256Hash.K[i] + b[i++];
            let temp2 = this.sigma0(t[0]) + this.majority(t[0], t[1], t[2]);
            t[7] = t[6];
            t[6] = t[5];
            t[5] = t[4];
            t[4] = t[3] + temp1;
            t[3] = t[2];
            t[2] = t[1];
            t[1] = t[0];
            t[0] = temp1 + temp2;
        }
    };

    sumValues(i: number, t: Int32Array) { 
        while (i < 8) { 
            this.hashed[i] = t[i] + this.hashed[i++];
        } 
    };

    sigma0(x: number): number {
        return (((x >>> 2) | (x << 30)) ^ ((x >>> 13) | (x << 19)) ^ ((x >>> 22) | (x << 10)))
    };

    sigma1(x: number): number { 
        return (((x >>> 6) | (x << 26)) ^ ((x >>> 11) | (x << 21)) ^ ((x >>> 25) | (x << 7)))
    };

    choice(x: number, y: number, z: number): number {
        return (x & y) ^ (~x & z);
    }

    majority(x: number, y: number, z: number): number {
        return (x & y) ^ (x & z) ^ (y & z);
    }

}
