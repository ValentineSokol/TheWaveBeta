export const STATES = {
    BEFORE_TAG: 0,
    INSIDE_OPENING_TAG: 1,
};
export const allowedTags = ['a', 'img', 'b', 'i', 'br', 'hr'];
export const selfClosingTags = [
    'area',
    'base',
    'br',
    'col',
    'embed',
    'hr',
    'img',
    'input',
    'link',
    'meta',
    'param',
    'source',
    'track',
    'wbr',
    'command',
    'keygen',
    'menuitem'
];
export const allowedAttributes = ['href', 'rel', 'src'];
