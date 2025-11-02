

const elements = new Map<string, HTMLElement>();

export function register(id: string, el: HTMLElement | null) {
    if (el) {
        elements.set(id, el);
    } else {
        elements.delete(id);
    }
}

export function shake(id: string, opts?: Partial<KeyframeAnimationOptions>): void {
    const el = elements.get(id);
    if (!el) return;

    el.animate(
        [
            { transform: 'translateX(0)' },
            { transform: 'translateX(-4px)' },
            { transform: 'translateX(4px)' },
            { transform: 'translateX(-4px)' },
            { transform: 'translateX(4px)' },
            { transform: 'translateX(0)' }
        ],
        { duration: 300, easing: 'ease-out', ...opts }
    );
}

export function shakeAll(idList: string[], opts?: Partial<KeyframeAnimationOptions>): void {
    idList.forEach(id => shake(id, opts));
}

export function pop(id: string, opts?: Partial<KeyframeAnimationOptions>): void {
    const el = elements.get(id);
    if (!el) return;

    el.animate(
        [
            { transform: 'scale(1)' },
            { transform: 'scale(1.1)' },
            { transform: 'scale(1)' }
        ],
        { duration: 120, easing: 'ease-out', ...opts }
    );
}

export async function flip(id: string, opts?: Partial<KeyframeAnimationOptions>): Promise<void> {
    const el = elements.get(id);
    if (!el) return;

    const frames: Keyframe[] = [
        { transform: 'perspective(700px) rotateX(0deg)',   transformOrigin: '50% 50%' },
        { transform: 'perspective(700px) rotateX(90deg)',  transformOrigin: '50% 50%' },
        { transform: 'perspective(700px) rotateX(180deg)', transformOrigin: '50% 50%' }
    ];

    const anim = el.animate(frames, {
        duration: 600,
        easing: 'cubic-bezier(.2,.6,.2,1)',
        ...opts
    });

    try {
        await anim.finished;
    } catch {
        // finished rejects if unmounted/cancelled — ignore
    }
}

export async function flipSequential(idList: string[], opts?: Partial<KeyframeAnimationOptions>, gap = 0): Promise<void> {
    for (const id of idList) {
        await flip(id, opts);
        if (gap > 0) {
            await new Promise(r => setTimeout(r, gap));
        }
    }
}