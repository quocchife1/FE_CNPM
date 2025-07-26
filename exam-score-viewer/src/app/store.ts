//store.ts
import { configureStore } from '@reduxjs/toolkit';
import scoreReducer from '../features/score/scoreSlice';
import { auditLogReducer } from '../features/auditLog';
import profileReducer from '../features/user/profileSlice';

export const store = configureStore({
  reducer: {
    score: scoreReducer,
    auditLog: auditLogReducer,
    profile: profileReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
