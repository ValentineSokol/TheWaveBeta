import { allowedTags, selfClosingTags, STATES } from './consts';
import { validateAttributes } from './utils';

const parse = html => new Promise((resolve, reject) => {
        let state = STATES.BEFORE_TAG;
        const tagStack = [];
        for (let i = 0; i < html.length; i += 1) {
            const char = html[i];
            if (state === STATES.BEFORE_TAG) {
                if (char === '<') {
                    state = STATES.INSIDE_OPENING_TAG;
                }
            }
            if (state === STATES.INSIDE_OPENING_TAG) {
                const closingBraceIndex = html.indexOf('>', i);
                if (!closingBraceIndex) {
                    state = STATES.BEFORE_TAG;
                    continue;
                }
                const openingTag = html.slice(i + 1, closingBraceIndex).trim();
                let tagName;
                const attributes = {};
                const firstSpace = openingTag.indexOf(' ');
                if (firstSpace === -1) {
                    tagName = openingTag;
                }
                else {
                    tagName = openingTag.slice(0, firstSpace);
                    if (tagName.startsWith('/')) {
                        reject(`Closing tags can not have attributes! ${openingTag}`);
                        return;
                    }
                    let attributeName = '', parsingAttributeValue = false, outerQuote, ignoringSpaces = false;
                    for (let j = firstSpace; j < openingTag.length; j += 1) {
                        const char = openingTag[j];
                        if (parsingAttributeValue) {
                            if (char === "'" || char === '"') {
                                if (!outerQuote) {
                                    outerQuote = char;
                                    ignoringSpaces = true;
                                    continue;
                                }
                                if (char === outerQuote) {
                                    ignoringSpaces = false;
                                    outerQuote = null;
                                    continue;
                                }
                            }
                            if (char === ' ') {
                                if (!ignoringSpaces) {
                                    parsingAttributeValue = false;
                                    attributeName = '';
                                    continue;
                                }
                            }
                            attributes[attributeName] += char;
                        }
                        else {
                            if (char !== ' ' && char !== '=') {
                                attributeName += char;
                            } else {
                                if (attributeName) {
                                    attributes[attributeName] = '';
                                }
                                if (char === '=') {
                                    parsingAttributeValue = true;
                                    continue;
                                }
                                attributeName = '';

                            }

                        }
                    }
                    if (outerQuote) {
                        reject(`Your HTML is invalid! Check the quotes around the attributes of tag:
                    <${openingTag}>`);
                    }
                }
                if (tagName.startsWith('/')) {
                    const openingTagName = tagName.slice(1);
                    const { tagName: lastTagInStack, index } = tagStack[tagStack.length - 1];
                    if (lastTagInStack !== openingTagName) {
                        reject(`You have an unclosed tag ${lastTagInStack}`);
                        return;
                    }
                    tagStack.pop();
                    if (!allowedTags.includes(openingTagName)) {
                        const charArray = html.split('');
                        charArray.splice(index, closingBraceIndex - index + 1);
                        html = charArray.join('');
                    }
                    state = STATES.BEFORE_TAG;
                    continue;
                }


                if (!allowedTags.includes(tagName)) {
                    if (selfClosingTags.includes(tagName)) {
                        const charArray = html.split('');
                        charArray.splice(i, closingBraceIndex + 1);
                        html = charArray.join('');
                    }
                }
                const hasTagBeenModified = validateAttributes(tagName, attributes);
                if (hasTagBeenModified) {
                    let attributesString = '';
                    for (const attributeName in attributes) {
                        attributesString += `${attributeName}='${attributes[attributeName]}'`;
                    }
                    const reconstructedOpeningTag = `<${tagName} ${attributesString}>`;
                    const charArray = html.split('');
                    charArray.splice(i, closingBraceIndex - i + 1, reconstructedOpeningTag);
                    html = charArray.join('');
                }

                if (!selfClosingTags.includes(tagName)) {
                    tagStack.push({ tagName, index: i });
                }
                state = STATES.BEFORE_TAG;
            }
        }
       resolve(html);
    });

export default parse;