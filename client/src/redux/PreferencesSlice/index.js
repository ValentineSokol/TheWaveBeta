import {createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const loadTranslationsThunk = createAsyncThunk(
    'loadTranslations',
    async (language) => {
       const translationsModule = await import(`../../consts/Locale/locale-${language}`);
       return { language, translations: translationsModule.default };
    }
    );
const preferencesSlice = createSlice( {
    name: 'preferencesSlice',
    initialState: { language: '', translations: {} },
    reducers: {
        setStartLanguage: (state, action) => { state.language = action.payload }
    },
    extraReducers: {
        [loadTranslationsThunk.fulfilled]: (state, {payload: { language, translations }}) => {
            state.translations = translations;
            state.language = language;
            localStorage.setItem('language', language);
        }
    }
});

export const preferencesReducer = preferencesSlice.reducer;
export const actions = preferencesSlice.actions;
export const loadTranslations = loadTranslationsThunk;
;
