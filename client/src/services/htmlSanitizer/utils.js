import {allowedAttributes} from "./consts";

export const validateAttributes = (tagName, attributes) => {
    let hasTagBeenModified = false;
    for (const attributeName in attributes) {
        const tagValue = attributes[attributeName].toLowerCase();
        // eslint-disable-next-line no-script-url
        if (!allowedAttributes.includes(attributeName) || tagValue.startsWith('javascript:')) {
            delete attributes[attributeName] ;
            hasTagBeenModified = true;
        }
    }
    const attributesAdded = appendNeededAttributes(tagName, attributes);
    hasTagBeenModified = attributesAdded ? true : hasTagBeenModified;
    return hasTagBeenModified;

};
export const appendNeededAttributes = (tagName, attributes) => {
    if (tagName === 'a') {
        attributes.target = '_blank';
        attributes.rel = 'noopener noreferrer';
        return true;
    }
}