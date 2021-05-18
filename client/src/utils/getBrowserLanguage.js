const getBrowserLanguage = () => {
    if (!window?.navigator?.language) {
        return 'en';
    }
    return window.navigator.language.slice(0, 2);
};

export default getBrowserLanguage;