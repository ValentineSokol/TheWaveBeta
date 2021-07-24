import {createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const loadTranslationsThunk = createAsyncThunk(
    'loadTranslations',
    async (language) => {
       const translationsModule = await import(`../../consts/Locale/locale-${language}`);
       return { language, translations: translationsModule.default };
    }
    );
const loadTranslationForComponentThunk = createAsyncThunk(
    'loadTranslationForComponent',
    async ({ translationKey, language }) => {
        const translationModule = await import(`../../consts/Locale/${translationKey}/${language}`);
        return { translationKey, translation: translationModule.default };
    }
);

const getSettings = () => JSON.parse(localStorage.getItem('settings'));

const preferencesSlice = createSlice( {
    name: 'preferencesSlice',
    initialState: { isNavbarVisible: true, language: '', ...getSettings(), translations: {} },
    reducers: {
        setStartLanguage: (state, action) => {
            state.language = action.payload;
            localStorage.setItem('language', action.payload);
        },
        setNavbarVisibility: (state, action) => {
            const updatedVisibility = action.payload;
            state.isNavbarVisible = updatedVisibility ?? !state.isNavbarVisible;
            if (state.isNavbarVisible) {
                window.scrollTo(0, 0);
            }
        },
        applySettings: (state, { payload: newSettings }) => {
            if (!newSettings) return;
            localStorage.setItem('settings', JSON.stringify(newSettings));
            return {...state, ...newSettings};
        }
    },
    extraReducers: {
        [loadTranslationForComponentThunk.fulfilled]: (state, action) => {
          const { translationKey, translation } = action.payload;
          state.translations[translationKey] = translation;
        }
    }
});

export const preferencesReducer = preferencesSlice.reducer;
export const actions = preferencesSlice.actions;
export const loadTranslations = loadTranslationsThunk;
export const loadTranslationForComponent = loadTranslationForComponentThunk;
