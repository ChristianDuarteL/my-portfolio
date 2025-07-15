abstract class Random {
    protected seed: bigint;

    constructor(seed: bigint = 0n) {
        this.seed = seed;
    }

    abstract next(bits: bigint): bigint;

    nextBigInt(bound: bigint): bigint {
        if(typeof bound === "number") {
            bound = BigInt(bound);
        }
        if(bound >= (1n << 31n)) {
            throw "Bound too large";
        }
        if(bound === 0n) {
            return this.next(32n);
        }
        let r = this.next(31n);
        let m = bound - 1n;
        if((bound & m) === 0n) {
            r = (r * m) >> 31n;
        }else {
            for (let u = r; u - (r = u % bound) + m < 0; u = this.next(31n));
        }
        return r;
    }

    nextInt(bound: number): number {
        return Number(this.nextBigInt(BigInt(bound)));
    }
}

const INT_MASK = 0x1n << 31n;

export class LinearRandom extends Random {
    static multiplier: bigint = 0x5DEECE66Dn;
    static addend: bigint = 0xBn;
    static mask = (0x1n << 48n) - 1n;

    constructor(seed: bigint = 0n) {
        super(seed);
    }

    next(bits: bigint): bigint {
        this.seed = (this.seed * LinearRandom.multiplier + LinearRandom.addend) & LinearRandom.mask;
        return (this.seed >> (48n - bits));
    }

    shuffle<T>(seq: T[]): T[] {
        const seq2 = [...seq];
        
        for(let i = 0; i < seq.length; ++i) {
            let ti = this.nextInt(seq.length);
            
            [seq2[i], seq2[ti]] = [seq2[ti], seq2[i]];
        }
        
        return seq2;
    }
}


export const randomInt = (max: number, min: number = 0): number => {
    min = min || 0;
    if(max) {
        return Math.floor(Math.random() * (max - min)) + min;
    } else {
        throw "Range undefined";
    }
};

export const shuffle = <T>(seq: T[]): T[] => {
    const seq2 = [...seq];
    
    for(let i = 0; i < seq.length; ++i) {
        let ti = randomInt(seq.length);
        
        [seq2[i], seq2[ti]] = [seq2[ti], seq2[i]];
    }
    
    return seq2;
};