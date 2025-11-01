import {useWordleStore} from "../store/wordleStore.ts";
import {useEffect, useRef, useState} from "react";
import {COLOURS} from "../gameConfig.ts";


export default function Toast() {
    const toastMessage = useWordleStore(s => s.toastMessage);
    const [showMessage, setShowMessage] = useState(false);
    const setToastMessage = useWordleStore(s => s.setToastMessage);
    const toastIdRef = useRef<number | null>(null);

    useEffect(() => {
        if (toastMessage) {
            setShowMessage(true);
            toastIdRef.current = setInterval(() => {
                setShowMessage(false);
                setToastMessage(null);
            }, 1500);
        } else {
            if (toastIdRef.current) clearTimeout(toastIdRef.current);
        }

        return () => {
            if (toastIdRef.current) clearTimeout(toastIdRef.current);
        };
    }, [toastMessage, setToastMessage]);


    return (
        <div className={`absolute top-24 left-1/2 -translate-x-1/2 px-4 py-2 rounded
        ${showMessage
            ? "opacity-100 translate-y-0 transition-all duration-200"
            : "opacity-0 -translate-y-2 transition-none pointer-events-none"}`}
             style={{ background: COLOURS.toast_bg, color: COLOURS.letter }}
        >
            {toastMessage}
        </div>
    );
}