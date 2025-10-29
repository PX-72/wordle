import {LetterStatus} from "../store/wordleStore.ts";
import {COLOURS} from "../gameConfig.ts";
import * as React from "react";

export function getKeyStyle(base: React.CSSProperties, status: LetterStatus): React.CSSProperties {
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