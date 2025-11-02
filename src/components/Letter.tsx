import {LetterStatus} from "../store/wordleStore.ts";
import {COLOURS} from "../gameConfig.ts";
import {getKeyStyle} from "../utils/keyColourUtils.ts";
import type {CSSProperties} from "react";
import {useAnimRef} from "../services/useAnimRef.ts";

type LetterProps = {
    id: string;
    letter: string | null;
    status: LetterStatus;
    row: number; // row this Letter instance belong to
}

function getStyle(status: LetterStatus = LetterStatus.Incorrect) {
    const base: CSSProperties = {
        borderColor: COLOURS.unguessed_border,
        backgroundColor: 'transparent',
        color: COLOURS.letter,
        fontSize: '1.9rem',
        fontWeight: 600
    };

    return getKeyStyle(base, status);
}

export function Letter({ id, letter, row, status = LetterStatus.Incorrect }: LetterProps) {
    const ref = useAnimRef(id);
    const st = getStyle(status);
    return (
      <div className={'flex justify-center items-center border-2 p-4 w-[62px] h-[62px]'}
           style={st}
           data-id={id}
           data-row={row}
           ref={ref}
      >
        <span>{letter}</span>
      </div>
    );
}