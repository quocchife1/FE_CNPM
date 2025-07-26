import { RootState } from '../../app/store';

export const selectProfile = (state: RootState) => state.profile.data;
export const selectProfileLoading = (state: RootState) => state.profile.loading;
