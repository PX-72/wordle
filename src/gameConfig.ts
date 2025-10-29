export const WORD_LEN = 5;
export const GUESSES = 6;

export const COLOURS = Object.freeze({
    page_bg: '#121414',
    keyboard_default: '#768085',
    letter: '#FFFFFF',
    unguessed_border: '#978c7c',
    incorrect_bg: '#373D3F',
    only_position_correct_bg: '#B59F3B',
    correct_bg: '#538D4E'
});

export const KEYS_ROW_1 = [
    'Q','W','E','R','T','Y','U','I','O','P',
];

export const KEYS_ROW_2 = [
    'A','S','D','F','G','H','J','K','L',
];

export const KEYS_ROW_3 = [
    'Z','X','C','V','B','N','M'
];

export const KEY_SET = new Set<string>([
    ...KEYS_ROW_1, ...KEYS_ROW_2, ...KEYS_ROW_3
]);