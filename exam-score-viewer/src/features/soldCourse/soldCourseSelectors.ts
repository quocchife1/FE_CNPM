// src/features/soldCourse/soldCourseSelectors.ts
import { RootState } from '../../app/store';

export const selectSoldCoursesAggregated = (state: RootState) => state.soldCourse.aggregated;
export const selectSoldCoursesRaw = (state: RootState) => state.soldCourse.raw;
export const selectSoldCoursesLoading = (state: RootState) => state.soldCourse.loading;
export const selectSoldCoursesError = (state: RootState) => state.soldCourse.error;
