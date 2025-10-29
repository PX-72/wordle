import {LetterStatus, useWordleStore} from "../store/wordleStore.ts";
import * as React from "react";
import {COLOURS, KEYS_ROW_1, KEYS_ROW_2, KEYS_ROW_3} from "../gameConfig.ts";
import {getKeyStyle} from "../utills/keyColourUtils.ts";

function Key({
     letter,
     status,
     action,
     style: overrideStyle = {}
}: {
    letter: string,
    status: LetterStatus,
    action: () => void,
    style?: React.CSSProperties;
}) {
    const base: React.CSSProperties = {
        backgroundColor: COLOURS.keyboard_default,
        color: COLOURS.letter,
        fontSize: '1.2rem',
        fontWeight: 600
    };

    const style = {
        ...base,
        ...getKeyStyle(base, status),
        ...overrideStyle
    };

    return (
        <div className="flex justify-center items-center rounded p-2 min-w-[42px] h-[58px] cursor-pointer"
             style={style}
             onClick={() => action()}>
            <span>{letter}</span>
        </div>
    );
}

function KeyList({
    keys,
    addLetter,
    deleteLetter,
    submit,
    wrongLetterSet,
    correctLetterSet,
    onlyPositionLetterSet,
    isControlRow,
}: {
    keys: string[];
    addLetter: (letter: string) => void,
    deleteLetter: () => void,
    submit: () => void,
    wrongLetterSet: Set<string>,
    correctLetterSet: Set<string>,
    onlyPositionLetterSet: Set<string>,
    isControlRow: boolean,
}) {
    const keyList = keys.map(k => {
        let keyStatus: LetterStatus = LetterStatus.Default;
        if (wrongLetterSet.has(k)) keyStatus = LetterStatus.Incorrect;
        else if (correctLetterSet.has(k)) keyStatus = LetterStatus.Correct;
        else if (onlyPositionLetterSet.has(k)) keyStatus = LetterStatus.OnlyPositionCorrect;

        return <Key key={k} letter={k} status={keyStatus} action={() => addLetter(k)} />;
    });

    if (isControlRow) {
        keyList.unshift(
            <Key key="enter" letter="ENTER" status={LetterStatus.Default}
                 action={() => submit()} style={{ fontSize: ".8rem", minWidth: "70px" }} />
        );
        keyList.push(
            <Key key="del" letter="DEL" status={LetterStatus.Default}
                 action={() => deleteLetter()} style={{ fontSize: ".8rem", minWidth: "70px" }} />
        );
    }

    return (
        <div className="flex flex-row gap-1.5 justify-center">{keyList}</div>
    );
}

export default function Keyboard() {
    const guesses = useWordleStore(s => s.guesses);
    const addLetter = useWordleStore(s => s.addLetter);
    const deleteLetter = useWordleStore(s => s.deleteLetter);
    const submit = useWordleStore(s => s.submit);
    const wrongLetterSet = new Set<string>();
    const correctLetterSet = new Set<string>();
    const onlyPositionLetterSet = new Set<string>();

    for(const letterStateList of guesses) {
        for (const letterState of letterStateList) {
            if (letterState.status === LetterStatus.Default) continue;
            if (letterState.status === LetterStatus.Correct) correctLetterSet.add( letterState.letter!);
            if (letterState.status === LetterStatus.Incorrect) wrongLetterSet.add( letterState.letter!);
            if (letterState.status === LetterStatus.OnlyPositionCorrect) onlyPositionLetterSet.add( letterState.letter!);
        }
    }

    return (
        <div className="flex flex-col gap-2 justify-center mt-12">
            <KeyList keys={KEYS_ROW_1} addLetter={addLetter} deleteLetter={deleteLetter} submit={submit}
                     correctLetterSet={correctLetterSet}
                     wrongLetterSet={wrongLetterSet}
                     onlyPositionLetterSet={onlyPositionLetterSet}
                     isControlRow={false}
            />
            <KeyList keys={KEYS_ROW_2} addLetter={addLetter} deleteLetter={deleteLetter} submit={submit}
                     correctLetterSet={correctLetterSet}
                     wrongLetterSet={wrongLetterSet}
                     onlyPositionLetterSet={onlyPositionLetterSet}
                     isControlRow={false}
            />
            <KeyList keys={KEYS_ROW_3} addLetter={addLetter} deleteLetter={deleteLetter} submit={submit}
                     correctLetterSet={correctLetterSet}
                     wrongLetterSet={wrongLetterSet}
                     onlyPositionLetterSet={onlyPositionLetterSet}
                     isControlRow={true}
            />
        </div>
    );
}