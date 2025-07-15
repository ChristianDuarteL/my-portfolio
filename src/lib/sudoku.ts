import { randomInt, shuffle, LinearRandom } from "./random";

const random = new LinearRandom(BigInt(Math.floor(new Date().getTime() / (1000 * 60))));

export const DIGITS = "123456789";
export const BOARD_LENGTH = DIGITS.length;
export const BOARD_SIZE = BOARD_LENGTH ** 2;
export const INNER_SQUARE_LENGTH = Math.round(Math.sqrt(BOARD_LENGTH));
export const INNER_SQUARE_SIZE = INNER_SQUARE_LENGTH ** 2; 
export const BLANK_CHAR = '.';
export const BLANK_INNER_SQUARE = BLANK_CHAR.repeat(INNER_SQUARE_LENGTH);
export const BLANK_BOARD = BLANK_CHAR.repeat(BOARD_SIZE);

const randomInnerSquare = (): string => {
    let innerSquare = "";
    let digits = DIGITS;
    for(let i = 0; i < INNER_SQUARE_SIZE; ++i) {
        const digit_index = random.nextInt(digits.length);
        const digit = digits[digit_index];
        innerSquare += digit;
        if(digits.length > 1){
            digits = digits.slice(0, digit_index) + digits.slice(digit_index + 1);
        }
    }
    return innerSquare;
};


export class Sudoku {
    public readonly fixed_board: string;
    public board: string;
    public boardCandidates: string[];
    private makeCandidatesOnSet: boolean;

    constructor(board?: string) {
        if(board) {
            this.board = board;
            this.boardCandidates = Array(BOARD_SIZE).fill(DIGITS);
            this.makeCandidatesOnSet = false;
            this.fixed_board = this.board;
            return;
        }
        this.makeCandidatesOnSet = true;
        this.boardCandidates = Array(BOARD_SIZE).fill(DIGITS);
        this.board = BLANK_BOARD;
        for(let i = 0; i < INNER_SQUARE_LENGTH; ++i) {
            const innerSquare = randomInnerSquare();
            for(let j = 0; j < INNER_SQUARE_LENGTH; ++j) {
                for(let k = 0; k < INNER_SQUARE_LENGTH; ++k) {
                    this.setNumber(j + i * INNER_SQUARE_LENGTH, k + i * INNER_SQUARE_LENGTH, innerSquare[j + k * INNER_SQUARE_LENGTH]);
                }
            }
        }
        this.fixed_board = this.board;
        this.solve();
        this.fixed_board = this.board;
    }
    
    solve(i = 0): boolean {
        if(this.fixed_board[i] !== BLANK_CHAR) {
            return i >= BOARD_SIZE - 1 ? true : this.solve(i + 1);
        }
        let candidates = random.shuffle(this.boardCandidates[i].split(''));
        for(let j = 0; j < candidates.length; ++j) {
            const prevCandiidates = [...this.boardCandidates];
            const prevboard = this.board;
            this.setNumberAt(i, candidates[j]);
            if(i >= BOARD_SIZE - 1) {
                return true;
            } else {
                if(this.solve(i + 1)) {
                    return true;
                }
            }
            this.boardCandidates = prevCandiidates;
            this.board = prevboard;
        }
        return false;
    }

    getIndex(x: number, y: number): number {
        return x + y * BOARD_LENGTH;
    }

    getPosition(i: number): [number, number] {
        return [i % BOARD_LENGTH, Math.floor(i / BOARD_LENGTH)];
    }

    setNumber(x: number, y: number, char: string) {
        this.setNumberAt(this.getIndex(x, y), char);
    }

    setNumberAt(i: number, char: string) {
        this.board = this.board.slice(0, i) + char + this.board.slice(i + 1);
        if(this.makeCandidatesOnSet) {
            this.boardCandidates[i] = char;
            const [x, y] = this.getPosition(i);
            for(let j = 0; j < BOARD_LENGTH; ++j) {
                const index = y * BOARD_LENGTH + j;
                this.boardCandidates[index] = this.boardCandidates[index].replace(char, "");
            }
            
            for(let j = 0; j < BOARD_LENGTH; ++j) {
                const index = j * BOARD_LENGTH + x;
                this.boardCandidates[index] = this.boardCandidates[index].replace(char, "");
            }
            
            const box_x = Math.floor(x / 3);
            const box_y = Math.floor(y / 3);
            for(let j = 0; j < INNER_SQUARE_LENGTH; ++j) {
                const index = (box_y * INNER_SQUARE_LENGTH + j) * BOARD_LENGTH + box_x * INNER_SQUARE_LENGTH;
                for(let k = 0; k < INNER_SQUARE_LENGTH; ++k) {
                    this.boardCandidates[index + k] = this.boardCandidates[index + k].replace(char, "");
                }
            }
        }
    }

    getLine(line: number): string {
        return this.board.slice(line * BOARD_LENGTH, (line + 1) * BOARD_LENGTH);
    }

    getColumn(column: number): string {
        let columnLine = "";
        for(let i = 0; i < BOARD_LENGTH; ++i) {
            columnLine += this.board[i * BOARD_LENGTH + column];
        }
        return columnLine;
    }

    getBox(box_x: number, box_y: number): string {
        let boxLine = "";
        for(let i = 0; i < INNER_SQUARE_LENGTH; ++i) {
            const lineStart = (box_y * INNER_SQUARE_LENGTH + i) * BOARD_LENGTH + box_x * INNER_SQUARE_LENGTH;
            boxLine += this.board.slice(lineStart, lineStart + INNER_SQUARE_LENGTH);
        }
        return boxLine;
    }

    cloneButHide(amount:number = 1): Sudoku {
        let board = this.board;
        const elements = random.shuffle([...Array(board.length).keys()]);
        for(let i = 0; i < amount; ++i) {
            const index = elements[i];
            board = board.slice(0, index) + BLANK_CHAR + board.slice(index + 1);
        }
        const clone = new Sudoku(board);
        return clone;
    }
}