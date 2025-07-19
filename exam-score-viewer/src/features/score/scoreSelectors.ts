import { RootState } from '../../app/store';

export const selectScores = (state: RootState) => state.score.results;
export const selectLoading = (state: RootState) => state.score.loading;
export const selectError = (state: RootState) => state.score.error;

