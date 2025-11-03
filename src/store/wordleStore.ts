import {create} from 'zustand';
import { devtools, persist, createJSONStorage, type PersistOptions, type StateStorage } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import { WORDLE_WORDS } from '../data/wordle_words.js';
import { ALLOWED_WORDS_SET } from '../data/wordle_allowed_words.js';
import * as config from '../gameConfig.js';
import {flip, pop, shakeAll, DEFAULT_FLIP_DURATION} from '../services/animationService.js';
import {getLetterId, getLetterIdsForRow} from "../utils/idUtils.ts";

export type LetterStatus = 0 | 1 | 2 | 3;
export const LetterStatus = {
    Default: 0,
    Incorrect: 1,
    OnlyPositionCorrect: 2,
    Correct: 3
} as const;

export type GameStatus = 0 | 1 | 2 | 3;
export const GameStatus = {
    NotPlayedYet: 0, // never played the game
    InProgress: 1,
    Won: 2,
    Lost: 3
} as const;

export type LetterState = {
    letter: string | null,
    status: LetterStatus,
}

type GameState = {
    gameStatus: GameStatus,
    toastMessage: string | null,
    currentWord: string,
    guesses: Array<Array<LetterState>>,
    currentRow: number,
    addLetter: (letter: string) => void,
    deleteLetter: () => void,
    submit: () => void,
    start: () => void,
    setToastMessage: (message: string | null) => void,
}

type WordlePersist = PersistOptions<GameState, GameState>;

const base64Storage: StateStorage = {
    getItem: (name) => {
        const raw = localStorage.getItem(name);
        return raw ? atob(raw) : null;
    },
    setItem: (name, value) => {
        localStorage.setItem(name, btoa(value));
    },
    removeItem: (name) => {
        localStorage.removeItem(name);
    },
};

const persistOptions: WordlePersist = {
    name: 'wordle-store-v2',
    storage: createJSONStorage(() => base64Storage),
};

const emptyCell = (): LetterState => ({
    letter: null,
    status: LetterStatus.Default
});

const getEmptyCells = (): GameState['guesses'] =>
    Array.from({ length: config.GUESSES }, () =>
        Array.from({ length: config.WORD_LEN }, emptyCell)
    );

export const useWordleStore = create<
    GameState,
    [
        ['zustand/devtools', never],
        ['zustand/persist', Partial<GameState>],
        ['zustand/immer', never]
    ]>(
    devtools(
        persist(
            immer((set, get) => ({
                gameStatus: GameStatus.NotPlayedYet,
                toastMessage: null,
                currentWord: '',
                guesses: getEmptyCells(),
                currentRow: 0,
                start: () =>
                    set((state: GameState) => {
                        state.currentWord = WORDLE_WORDS[Math.floor(Math.random() * WORDLE_WORDS.length)];
                        state.guesses = getEmptyCells();
                        state.currentRow = 0;
                        state.gameStatus = GameStatus.InProgress;
                    }),
                addLetter: (letter: string) =>
                    set((state: GameState) => {
                        if (state.gameStatus !== GameStatus.InProgress) return;
                        const row = state.currentRow;
                        for(let i = 0; i < config.WORD_LEN; i++) {
                            if (state.guesses[row][i].letter === null) {
                                state.guesses[row][i] = {letter, status: LetterStatus.Default};
                                pop(getLetterId(row, i));
                                break;
                            }
                        }
                    }),
                deleteLetter: () =>
                    set((state: GameState) => {
                        if (state.gameStatus !== GameStatus.InProgress) return;
                        const row = state.currentRow;
                        for(let i = config.WORD_LEN - 1; i >= 0; i--) {
                            if (state.guesses[row][i].letter !== null) {
                                state.guesses[row][i] = emptyCell();
                                break;
                            }
                        }
                    }),
                submit: async () => {
                    const store = get();
                    if (store.gameStatus !== GameStatus.InProgress) return;
                    const row = store.currentRow;
                    const currentRowCopy = store.guesses[row].map(x => ({...x}));

                    if (currentRowCopy.some(x => x.letter === null)) {
                        set((s) => { s.toastMessage = 'Not enough letters'; });
                        shakeAll(getLetterIdsForRow(row));
                        return;
                    }

                    const currentGuessedWord = currentRowCopy.map(x => x.letter).join('').toLowerCase();
                    if (!ALLOWED_WORDS_SET.has(currentGuessedWord)) {
                        set((s) => { s.toastMessage = 'Not in word list'; });
                        shakeAll(getLetterIdsForRow(row));
                        return;
                    }

                    // 0. create map with current word letter as key and its indexes in the word as the value
                    const letterMap = new Map<string, number[]>();
                    for(let i = 0; i < store.currentWord.length; i++) {
                        const char = store.currentWord[i];
                        if (letterMap.has(char)) letterMap.get(char)!.push(i);
                        else letterMap.set(char, [i]);
                    }

                    for(const [char, indexList] of letterMap) {
                        const usedIndexSet = new Set();
                        // 1. set correct matches
                        for(const i of indexList) {
                            if (currentRowCopy[i].letter!.toUpperCase() === char.toUpperCase()) {
                                currentRowCopy[i].status = LetterStatus.Correct;
                                usedIndexSet.add(i);
                            }
                        }
                        // 2. set letters that exist, but in wrong position
                        for(const i of indexList.filter(x => !usedIndexSet.has(x))) {
                            for (const c of currentRowCopy.filter(x => x.status === LetterStatus.Default)) {
                                if (c.letter!.toUpperCase() === char.toUpperCase()) {
                                    c.status = LetterStatus.OnlyPositionCorrect;
                                    usedIndexSet.add(i);
                                }
                            }
                        }
                    }
                    // 3. set the rest to incorrect
                    for (const c of currentRowCopy.filter(x => x.status === LetterStatus.Default)) {
                        c.status = LetterStatus.Incorrect;
                    }

                    const animPromises: Promise<void>[] = [];
                    for (let c = 0; c < currentRowCopy.length; c++) {
                        const id = getLetterId(row, c);
                        animPromises.push(flip(id, {
                            delay: c * (DEFAULT_FLIP_DURATION / 2),
                            onHalfway: () => {
                                set(s => {
                                    s.guesses[row][c].status = currentRowCopy[c].status;
                                });
                            },
                        }));
                    }

                    await Promise.all(animPromises);

                    set((state: GameState) => {
                        // 4. check result
                        if (state.guesses[row].every(x => x.status === LetterStatus.Correct)) {
                            state.gameStatus = GameStatus.Won;
                            return;
                        }
                        if (row === config.GUESSES - 1) {
                            state.gameStatus = GameStatus.Lost;
                            return;
                        }

                        state.currentRow = row + 1;
                    });
                },
                setToastMessage: (message: string | null) => {
                    set((state: GameState) => {
                        state.toastMessage = message;
                    });
                },
            })),
            persistOptions
        ),
        { name: 'WordleStore' }
    )
);