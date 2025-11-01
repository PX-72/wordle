import {LetterStatus} from "../store/wordleStore.ts";
import {COLOURS} from "../gameConfig.ts";
import * as React from "react";
import {getKeyStyle} from "../utills/keyColourUtils.ts";

type LetterProps = {
    letter: string | null;
    status: LetterStatus;
}

function getStyle(status: LetterStatus = LetterStatus.Incorrect) {
    const base: React.CSSProperties = {
        borderColor: COLOURS.unguessed_border,
        backgroundColor: 'transparent',
        color: COLOURS.letter,
        fontSize: '1.9rem',
        fontWeight: 600
    };

    return getKeyStyle(base, status);
}

export function Letter({ letter, status = LetterStatus.Incorrect }: LetterProps) {
    const st = getStyle(status);
    return (
      <div
          className={
              `flex justify-center items-center border-2 p-4 w-[62px] h-[62px] 
              ${letter ? "animate-newLetter" : ""}
          `}
           style={st} >
        <span>{letter}</span>
      </div>
    );
}