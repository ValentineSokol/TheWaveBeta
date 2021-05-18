import {createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import getBrowserLanguage from '../../utils/getBrowserLanguage';

const loadTranslations = createAsyncThunk(
    'loadTranslations',
    async (language) => {
       const translationsModule = await import(`../../consts/Locale/locale-${language}`);
       return translationsModule.default;
    }
    );
const preferencesSlice = createSlice( {
    name: 'preferencesSlice',
    initialState: { language: getBrowserLanguage(), translations: {} },
    reducers: {
        setLanguage: (state, { payload:  { newLanguage, newTranslations } }) => {
            state.language = newLanguage;
            state.translations = newTranslations;
            return state;
        }
    },
    extraReducers: {
        [loadTranslations.fulfilled]: (state, action) => { state.translations = action.payload; }
    }
});

export const preferencesReducer = preferencesSlice.reducer;
export const actions = preferencesSlice.actions;
export const changeTranslations = loadTranslations;
