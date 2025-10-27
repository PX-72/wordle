import { useEffect } from 'react';
import {WordList} from "./components/WordList.tsx";
import {useWordleStore} from "./store/wordleStore.ts";
import {KEY_SET} from "./gameConfig.ts";

function App() {
    const addLetter = useWordleStore(s => s.addLetter);
    const deleteLetter = useWordleStore(s => s.deleteLetter);

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            const key = event.key;

            if (key === 'Backspace') {
                deleteLetter();
            } else if (key === 'Enter') {
                console.log('Enter pressed');
            } else if (key.length === 1) {
                const char = key.toUpperCase();
                if (KEY_SET.has(char)) {
                    addLetter(char);
                }
            }
        };

        window.addEventListener('keyup', handleKeyDown);

        return () => {
            window.removeEventListener('keyup', handleKeyDown);
        };
    }, [addLetter, deleteLetter]);

    return (
        <div>
            <WordList/>
        </div>
    );
}

export default App;
