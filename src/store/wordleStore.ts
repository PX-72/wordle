import {create} from 'zustand';
import { devtools, persist, createJSONStorage, type PersistOptions } from 'zustand/middleware';
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

type GameState = {
    gameStatus: GameStatus,
    currentWord: string,
    guesses: Array<Array<LetterState>>,
    currentRow: number,
    addLetter: (letter: string) => void,
    deleteLetter: () => void,
    submit: () => void,
}

type WordlePersist = PersistOptions<GameState, GameState, unknown>;

const persistOptions: WordlePersist = {
    name: 'wordle-store',
    storage: createJSONStorage(() => localStorage),
};

const emptyCell = (): LetterState => ({
    letter: null,
    status: LetterStatus.Default,
});

export const useWordleStore = create<
    GameState,
    [
        ['zustand/devtools', never],
        ['zustand/persist', Partial<GameState>],
        ['zustand/immer', never]
    ]>(
    devtools(
        persist(
            immer((set) => ({
                gameStatus: GameStatus.InProgress,
                currentWord: 'toast',
                guesses: Array.from({ length: config.GUESSES }, () =>
                    Array.from({ length: config.WORD_LEN }, emptyCell)
                ),
                currentRow: 0,
                addLetter: (letter: string) =>
                    set((state: GameState) => {
                        const row = state.currentRow;
                        for(let i = 0; i < config.WORD_LEN; i++) {
                            if (state.guesses[row][i].letter === null) {
                                state.guesses[row][i] = {letter, status: LetterStatus.Default};
                                break;
                            }
                        }
                    }),
                deleteLetter: () =>
                    set((state: GameState) => {
                        const row = state.currentRow;
                        for(let i = config.WORD_LEN - 1; i >= 0; i--) {
                            if (state.guesses[row][i].letter !== null) {
                                state.guesses[row][i] = emptyCell();
                                break;
                            }
                        }
                    }),
                submit: () =>
                    set((state: GameState) => {
                        const row = state.currentRow;
                        const currentRowWord = state.guesses[row];
                        if (state.gameStatus !== GameStatus.InProgress || currentRowWord.some(x => x.letter === null)) return;

                        // 0. create map with current word letter as key and its indexes in the word as the value
                        const letterMap = new Map<string, number[]>();
                        for(let i = 0; i < state.currentWord.length; i++) {
                            const char = state.currentWord[i];
                            if (letterMap.has(char)) letterMap.get(char)!.push(i);
                            else letterMap.set(char, [i]);
                        }
                        for(const [char, indexList] of letterMap) {
                            const usedIndexSet = new Set();
                            // 1. set correct matches
                            for(const i of indexList) {
                                if (currentRowWord[i].letter!.toUpperCase() === char.toUpperCase()) {
                                    currentRowWord[i].status = LetterStatus.Correct;
                                    usedIndexSet.add(i);
                                }
                            }
                            // 2. set letters that exist, but in wrong position
                            for(const i of indexList.filter(x => !usedIndexSet.has(x))) {
                                for (const c of currentRowWord.filter(x => x.status === LetterStatus.Default)) {
                                    if (c.letter!.toUpperCase() === char.toUpperCase()) {
                                        c.status = LetterStatus.OnlyPositionCorrect;
                                        usedIndexSet.add(i);
                                    }
                                }
                            }
                        }
                        // 3. set the rest to incorrect
                        for (const c of currentRowWord.filter(x => x.status === LetterStatus.Default)) {
                            c.status = LetterStatus.Incorrect;
                        }

                        if (row < config.GUESSES - 1) state.currentRow = row + 1;
                    }),
            })),
            persistOptions
        ),
        { name: 'WordleStore' }
    )
);