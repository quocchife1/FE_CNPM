// exam-score-viewer/src/features/soldCourse/soldCourseThunks.ts
import { createAsyncThunk } from '@reduxjs/toolkit';
import { fetchSoldCourses } from '../../api/soldCourseApi';

export const getSoldCourses = createAsyncThunk(
  'soldCourse/getSoldCourses',
  async (_, thunkAPI) => {
    try {
      const response = await fetchSoldCourses();
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);
