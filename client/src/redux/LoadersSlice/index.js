import { createSlice } from "@reduxjs/toolkit";
import * as chatApi from '../actions/api/chat';
import * as api from '../actions/api';
const loadersSlice = createSlice( {
    name: 'LoadersSlice',
    initialState: { activeRequests: [], failedRequests: [] },
    extraReducers: (builder) => {
      const thunksToWatch = { ...chatApi, ...api };
      for (const key in thunksToWatch) {
        const thunk = thunksToWatch[key];
        builder.addCase(thunk.pending, (state) => {
          state.failedRequests = state.failedRequests.filter(key => key !== thunk.rejected.toString());
          const requestKey = thunk.pending.toString();
          if (state.activeRequests.includes(requestKey)) return state;
          state.activeRequests.push(requestKey);
        });
        builder.addCase(thunk.rejected, (state, { payload }) => {
           const errorKey = thunk.rejected.toString();
           state.failedRequests.push(errorKey);
           state.activeRequests = state.activeRequests.filter(key => key !== thunk.pending.toString());
           console.error(payload);
        });
          builder.addCase(thunk.fulfilled, (state) => {
              state.activeRequests = state.activeRequests.filter(key => key !== thunk.pending.toString());
          });
      }

    }
});

export const loadersReducer = loadersSlice.reducer;
export const actions = loadersSlice.actions;