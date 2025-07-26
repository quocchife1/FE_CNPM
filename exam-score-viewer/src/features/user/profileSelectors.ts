// profileSelectors.ts
import { RootState } from '../../app/store';

export const selectProfile = (state: RootState) => state.profile.profile;
export const selectProfileLoading = (state: RootState) => state.profile.loading;
