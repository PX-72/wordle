import { useWordleStore } from "../store/wordleStore.ts";
import { WORD_LEN } from "../gameConfig.ts";
import type {ReactElement} from "react";
import {Letter} from "./Letter.tsx";

export function WordList() {
    const guesses = useWordleStore(s => s.guesses);

    const cells: ReactElement[] = [];
    for (let c = 0; c < guesses.length; c++){
        const guess = guesses[c];
        cells.push(...guess.map(((l, r) => <Letter key={`${c}-${r}`} letter={l.letter} status={l.status}/>)));
    }
    return (
        <div className="grid gap-1.5" style={{ gridTemplateColumns: `repeat(${WORD_LEN}, auto)` }}>
            {cells}
        </div>
    );
}