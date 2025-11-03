

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
            { transform: 'scale(1.2)' },
            { transform: 'scale(1)' }
        ],
        { duration: 60, ...opts }
    );
}

type FlipOpts = Partial<KeyframeAnimationOptions> & { onHalfway?: () => void };

export const DEFAULT_FLIP_DURATION = 800;

export async function flip(id: string, opts?: FlipOpts): Promise<void> {
    const el = elements.get(id);
    if (!el) return;

    const duration = opts?.duration as number ?? DEFAULT_FLIP_DURATION;
    const delay = opts?.delay ?? 0;
    const frames: Keyframe[] = [
        { transform: 'perspective(700px) rotateX(0deg)',   transformOrigin: '50% 50%' },
        { transform: 'perspective(700px) rotateX(90deg)',  transformOrigin: '50% 50%' },
        { transform: 'perspective(700px) rotateX(0deg)',   transformOrigin: '50% 50%' },
    ];

    const anim = el.animate(frames, {
        duration,
        delay,
        easing: 'cubic-bezier(.2,.6,.2,1)',
        iterations: 1,
        fill: 'none',
        ...opts,
    });

    // fire halfway callback at ~90°
    if (opts?.onHalfway) {
        try { await anim.ready; } catch {/* */}
        const t = window.setTimeout(() => { try { opts.onHalfway!(); } catch {/* */} }, delay);
        anim.finished.finally(() => clearTimeout(t)).catch(() => clearTimeout(t));
    }

    try { await anim.finished; } catch {/* */}
}