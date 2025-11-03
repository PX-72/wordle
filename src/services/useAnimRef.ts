import { useCallback, useEffect } from "react";
import { register } from "./animationService";

export function useAnimRef(id: string) {
    const ref = useCallback((el: HTMLElement | null) => register(id, el), [id]);
    useEffect(() => () => register(id, null), [id]); // cleanup
    return ref;
}