import { configureStore } from '@reduxjs/toolkit';
import scoreListReducer from '../features/scoreList/scoreListSlice';

export const store = configureStore({
  reducer: {
    scoreList: scoreListReducer,
  },
});
