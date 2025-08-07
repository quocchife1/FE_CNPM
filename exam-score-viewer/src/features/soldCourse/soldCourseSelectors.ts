// src/features/soldCourse/soldCourseSelectors.ts
import { RootState } from '../../app/store';

export const selectSoldCourses = (state: RootState) => state.soldCourse.data;
export const selectSoldCoursesLoading = (state: RootState) => state.soldCourse.loading;
export const selectSoldCoursesError = (state: RootState) => state.soldCourse.error;
