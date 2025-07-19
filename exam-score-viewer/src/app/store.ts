import { configureStore } from '@reduxjs/toolkit';
import scoreReducer from '../features/score/scoreSlice';
import { auditLogReducer } from '../features/auditLog'; //

export const store = configureStore({
  reducer: {
    score: scoreReducer,
    auditLog: auditLogReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
