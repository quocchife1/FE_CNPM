//store.ts
import { configureStore } from '@reduxjs/toolkit';
import scoreReducer from '../features/score/scoreSlice';
import { auditLogReducer } from '../features/auditLog';
import profileReducer from '../features/user/profileSlice';
import soldCourseReducer from '../features/soldCourse/soldCourseSlice';

export const store = configureStore({
  reducer: {
    score: scoreReducer,
    auditLog: auditLogReducer,
    profile: profileReducer,
    soldCourse: soldCourseReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
