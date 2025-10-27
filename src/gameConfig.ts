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

export const KEY_SET = new Set<string>([
    'A','B','C','D','E','F','G','H','I','J','K','L','M',
    'N','O','P','Q','R','S','T','U','V','W','X','Y','Z'
]);