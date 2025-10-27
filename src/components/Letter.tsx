import {LetterStatus} from "../store/wordleStore.ts";
import {COLOURS} from "../gameConfig.ts";
import * as React from "react";

type LetterProps = {
    letter: string | null;
    status: LetterStatus
}

function getStyle(status: LetterStatus = LetterStatus.Incorrect) {
    const base: React.CSSProperties = {
        borderColor: COLOURS.unguessed_border,
        backgroundColor: 'transparent',
        color: COLOURS.letter,
        fontSize: '1.75rem',
        //fontFamily: 'Poppins, sans-serif',
        fontWeight: 500
    };

    switch (status) {
        case LetterStatus.Incorrect:
            return {...base, borderColor: COLOURS.incorrect_bg, backgroundColor: COLOURS.incorrect_bg};
        case LetterStatus.OnlyPositionCorrect:
            return {...base, borderColor: COLOURS.only_position_correct_bg, backgroundColor: COLOURS.only_position_correct_bg};
        case LetterStatus.Correct:
            return {...base, borderColor: COLOURS.correct_bg, backgroundColor: COLOURS.correct_bg};
        default:
            return base;
    }
}

export function Letter({ letter, status = LetterStatus.Incorrect }: LetterProps) {
    const st = getStyle(status);
    return (
      <div className="flex justify-center items-center border-2 p-4 w-[62px] h-[62px]" style={st} >
        <span>{letter}</span>
      </div>
    );
}