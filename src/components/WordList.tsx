import { useWordleStore } from "../store/wordleStore.ts";
import { WORD_LEN } from "../gameConfig.ts";
import type {ReactElement} from "react";
import {Letter} from "./Letter.tsx";
import {getLetterId} from "../utils/idUtils.ts";

export function WordList() {
    const guesses = useWordleStore(s => s.guesses);

    const cells: ReactElement[] = [];
    for (let r = 0; r < guesses.length; r++){
        const guess = guesses[r];
        cells.push(...guess.map(((l, c) => {
            const id = getLetterId(r, c);
            return <Letter key={id} id={id} letter={l.letter} row={r} status={l.status}/>;
        })));
    }
    return (
        <div className="flex justify-center">
            <div className="grid gap-1.5 max-w-[400px]" style={{ gridTemplateColumns: `repeat(${WORD_LEN}, auto)` }}>
                {cells}
            </div>
        </div>
    );
}