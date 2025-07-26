// profileSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { fetchProfileById, updateProfileById } from '../../api/profileApi';

export interface Profile {
  id: number;
  name: string;
  phone: string;
  email: string;
  avatarUrl: string;
  address: string;
  createdAt: string;
}

interface ProfileState {
  profile: Profile | null;
  loading: boolean;
  error: string | null;
}

const initialState: ProfileState = {
  profile: null,
  loading: false,
  error: null,
};

const getUserId = () => {
  const id = localStorage.getItem('userId');
  return id ? Number(id) : null;
};

export const fetchUserProfile = createAsyncThunk(
  'profile/fetchUserProfile',
  async (_, thunkAPI) => {
    const userId = getUserId();
    if (!userId) return thunkAPI.rejectWithValue('Chưa có userId');
    try {
      const data = await fetchProfileById(userId);
      return data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const saveUserProfile = createAsyncThunk(
  'profile/saveUserProfile',
  async (
    formData: FormData,
    thunkAPI
  ) => {
    const userId = getUserId();
    if (!userId) return thunkAPI.rejectWithValue('Chưa có userId');
    try {
      const updated = await updateProfileById(userId, formData);
      return updated;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserProfile.fulfilled, (state, action: PayloadAction<Profile>) => {
        state.loading = false;
        state.profile = action.payload;
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.profile = null;
      })
      .addCase(saveUserProfile.pending, (state) => {
        state.loading = true;
      })
      .addCase(saveUserProfile.fulfilled, (state, action: PayloadAction<Profile>) => {
        state.loading = false;
        state.profile = action.payload;
      })
      .addCase(saveUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default profileSlice.reducer;
