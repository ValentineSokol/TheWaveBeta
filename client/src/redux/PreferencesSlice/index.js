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
const preferencesSlice = createSlice( {
    name: 'preferencesSlice',
    initialState: { language: '', translations: {} },
    reducers: {
        setStartLanguage: (state, action) => {
            state.language = action.payload;
            localStorage.setItem('language', action.payload);
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
