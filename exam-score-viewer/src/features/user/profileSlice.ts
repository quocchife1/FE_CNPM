import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  fetchProfileById,
  updateProfileById,
} from '../../api/profileApi';

interface ProfileState {
  data: {
    id: number;
    name: string;
    phone: string;
    address: string;
    avatarUrl: string;
    email: string; 
    createdAt: string;
  } | null;
  loading: boolean;
  error: string | null;
}

const initialState: ProfileState = {
  data: null,
  loading: false,
  error: null,
};

// Fetch profile by userId (from URL)
export const fetchUserProfile = createAsyncThunk(
  'profile/fetchUserProfile',
  async (userId: number) => {
    const response = await fetchProfileById(userId);
    return response;
  }
);

// Save profile with FormData
export const saveUserProfile = createAsyncThunk(
  'profile/saveUserProfile',
  async ({ userId, formData }: { userId: number; formData: FormData }) => {
    const response = await updateProfileById(userId, formData);
    return response;
  }
);

const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch
      .addCase(fetchUserProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Lỗi tải hồ sơ';
      })

      // Save
      .addCase(saveUserProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(saveUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(saveUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Lỗi lưu hồ sơ';
      });
  },
});

export default profileSlice.reducer;
