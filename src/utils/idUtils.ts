import {WORD_LEN} from '../gameConfig.js';


export function getLetterId(row: number, column: number): string {
    return `letter-${row}-${column}`;
}

export function getLetterIdsForRow(row: number): string[] {
    const arr: string[] = [];
    for(let c = 0; c < WORD_LEN; c++) {
        arr.push(getLetterId(row, c));
    }

    return arr;
}