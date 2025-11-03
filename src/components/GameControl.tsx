import { useEffect, useState } from "react";
import {useWordleStore, GameStatus} from "../store/wordleStore.ts";
import * as config from '../gameConfig.js';

export default function GameControl() {
    const [text, setText] = useState('');
    const [isGameInProgress, setIsGameInProgress] = useState(true); // set to true to avoid briefly showing incorrect state
    const gameStatus = useWordleStore(s => s.gameStatus);
    const currentWord = useWordleStore(s => s.currentWord);
    const start = useWordleStore(s => s.start);

    useEffect(() => {
        switch (gameStatus) {
            case GameStatus.NotPlayedYet:
                start();
                break;
            case GameStatus.Lost:
                setText(`The word was: ${currentWord.toUpperCase()}`);
                setIsGameInProgress(false);
                break;
            case GameStatus.Won:
                setText('Well done!');
                setIsGameInProgress(false);
                break;
            case GameStatus.InProgress:
                setText('Word is set. Good luck!');
                setIsGameInProgress(true);
                break;
        }
    }, [gameStatus, currentWord, start]);

    return (
        <div className="flex flex-col items-center justify-center">
            <div className="text-3xl" style={{ color: config.COLOURS.letter }} >{text}</div>
            <button
                className={`px-3 py-1 mt-8 mb-10 rounded cursor-pointer hover:brightness-90 ${
                    isGameInProgress ? "invisible" : ""
                }`}
                style={{ color: config.COLOURS.letter, background: config.COLOURS.correct_bg }}
                onClick={() => start()}
            >
                Play another game
            </button>
        </div>
    );
}
