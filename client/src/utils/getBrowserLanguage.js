const getBrowserLanguage = () => {
    const savedLanguage = localStorage.getItem('language');
    if (savedLanguage) return savedLanguage;

    if (!window?.navigator?.language) {
        return 'en';
    }
    return 'en';
    return window.navigator.language.slice(0, 2);
};

export default getBrowserLanguage;