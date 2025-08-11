// src/features/soldCourse/soldCourseSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { fetchSoldCourseList, SoldCourseRaw } from './soldCourseThunks';

export interface AggregatedCourse {
  id: number;
  name: string;
  price: number;
  count: number;
}

interface SoldCourseState {
  raw: SoldCourseRaw[];
  aggregated: AggregatedCourse[];
  loading: boolean;
  error: string | null;
}

const initialState: SoldCourseState = {
  raw: [],
  aggregated: [],
  loading: false,
  error: null,
};

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
      .addCase(fetchSoldCourseList.fulfilled, (state, action: PayloadAction<SoldCourseRaw[]>) => {
        state.loading = false;
        state.raw = action.payload;

        // aggregate counts by course id
        const map = new Map<number, AggregatedCourse>();
        action.payload.forEach((item) => {
          const existing = map.get(item.id);
          if (existing) {
            existing.count += 1;
          } else {
            map.set(item.id, { id: item.id, name: item.name, price: item.price, count: 1 });
          }
        });

        state.aggregated = Array.from(map.values()).sort((a, b) => b.count - a.count);
      })
      .addCase(fetchSoldCourseList.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || action.error.message || 'Lỗi khi tải dữ liệu';
      });
  },
});

export default soldCourseSlice.reducer;
