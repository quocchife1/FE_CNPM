// src/features/soldCourse/soldCourseThunks.ts
import { createAsyncThunk } from '@reduxjs/toolkit';
import { fetchSoldCourses } from '../../api/soldCourseApi';

export interface SoldCourseRaw {
  id: number;
  name: string;
  price: number;
}

export const fetchSoldCourseList = createAsyncThunk<SoldCourseRaw[], void, { rejectValue: string }>(
  'soldCourse/fetchSoldCourseList',
  async (_, thunkAPI) => {
    try {
      const data = await fetchSoldCourses();
      return data as SoldCourseRaw[];
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err.message || 'Lỗi khi gọi API soldcourse');
    }
  }
);
