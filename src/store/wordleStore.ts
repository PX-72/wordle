import {create} from 'zustand';
import { devtools } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import * as config from '../gameConfig.js';

export type LetterStatus = 0 | 1 | 2 | 3;
export const LetterStatus = {
    Default: 0,
    Incorrect: 1,
    OnlyPositionCorrect: 2,
    Correct: 3
} as const;

export type GameStatus = 0 | 1 | 2 | 3;
export const GameStatus = {
    NotStarted: 0,
    InProgress: 1,
    Won: 2,
    Lost: 3
} as const;

type LetterState = {
    letter: string | null,
    status: LetterStatus
}

type Position = [number, number];

type GameState = {
    gameStatus: GameStatus,
    currentWord: string,
    guesses: Array<Array<LetterState>>,
    currentPosition: Position,
    addLetter: (letter: string) => void,
    deleteLetter: () => void
}

export const useWordleStore = create<GameState, [['zustand/devtools', never], ['zustand/immer', never]]>(
    devtools(
        immer((set) => ({
            gameStatus: GameStatus.NotStarted,
            currentWord: '',
            guesses: Array.from({ length: config.GUESSES }, () => Array(config.WORD_LEN).fill({letter: null, status: LetterStatus.Default})),
            currentPosition: [0, 0],
            addLetter: (letter: string) =>
                set((state: GameState) => {
                    const [row, col] = state.currentPosition;
                    const isLastLetter = col === config.WORD_LEN - 1;
                    if (isLastLetter || state.guesses[row][col].letter !== null) return;
                    state.guesses[row][col] = {letter, status: LetterStatus.Default};
                    if (!isLastLetter) state.currentPosition = [row, col + 1];
                }),
            deleteLetter: () =>
                set((state: GameState) => {
                    const [row, col] = state.currentPosition;
                    state.guesses[row][col] = {letter: null, status: LetterStatus.Default};
                    if(col > 0) state.currentPosition = [row, col - 1];
                }),
        })),
        { name: 'WordleStore' }
    )
);