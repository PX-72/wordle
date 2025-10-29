import { useEffect, useState } from "react";
import {useWordleStore, GameStatus} from "../store/wordleStore.ts";
import * as config from '../gameConfig.js';

export default function GameControl() {
    const [text, setText] = useState('');
    const [buttonText, setButtonText] = useState('');
    const [isGameInProgress, setIsGameInProgress] = useState(false);
    const gameStatus = useWordleStore(s => s.gameStatus);
    const start = useWordleStore(s => s.start);

    useEffect(() => {
        let t = '';
        let bt = 'Play another game';
        switch (gameStatus) {
            case GameStatus.NotStarted:
                t = 'Welcome!';
                bt = 'Start';
                break;
            case GameStatus.Lost:
                t = 'Maybe next time.';
                break;
            case GameStatus.Won:
                t = 'Well done!';
                break;
            case GameStatus.InProgress:
                t = 'Word is set. Go for it!';
                break;
        }

        setText(t);
        setButtonText(bt);
        setIsGameInProgress(gameStatus === GameStatus.InProgress);
    }, [gameStatus]);

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
                {buttonText}
            </button>
        </div>
    );
}
