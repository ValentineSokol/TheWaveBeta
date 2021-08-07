import {createAction} from '@reduxjs/toolkit';

export  const queryParamsChanged = createAction('queryParamsChanged', (queryParams) => ({ payload: queryParams }));