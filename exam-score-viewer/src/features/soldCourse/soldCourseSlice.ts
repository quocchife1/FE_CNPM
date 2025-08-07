// src/features/soldCourse/soldCourseSlice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchSoldCourses } from '../../api/soldCourseApi';

interface SoldCourse {
  name: string;
  price: number;
}

interface SoldCourseState {
  data: SoldCourse[];
  loading: boolean;
  error: string | null;
}

const initialState: SoldCourseState = {
  data: [],
  loading: false,
  error: null,
};

export const fetchSoldCourseList = createAsyncThunk(
  'soldCourse/fetchSoldCourseList',
  async () => {
    const response = await fetchSoldCourses();
    return response;
  }
);

const soldCourseSlice = createSlice({
  name: 'soldCourse',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSoldCourseList.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSoldCourseList.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchSoldCourseList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Lỗi khi tải danh sách';
      });
      
  },
});

export default soldCourseSlice.reducer;
