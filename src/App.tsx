import { useEffect } from 'react';
import {WordList} from "./components/WordList.tsx";
import {useWordleStore} from "./store/wordleStore.ts";
import {KEY_SET} from "./gameConfig.ts";

function App() {
    const addLetter = useWordleStore(s => s.addLetter);
    const deleteLetter = useWordleStore(s => s.deleteLetter);
    const submit = useWordleStore(s => s.submit);

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            const key = event.key;

            if (key === 'Backspace') {
                deleteLetter();
            } else if (key === 'Enter') {
                submit();
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
    }, [addLetter, deleteLetter, submit]);

    return (
        <div>
            <WordList/>
        </div>
    );
}

export default App;
