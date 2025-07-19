import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Thunk gọi API
export const fetchScoreList = createAsyncThunk(
  'scoreList/fetchScoreList',
  async (examId, thunkAPI) => {
    const response = await axios.get(`http://localhost:8080/api/v1/listresult/${examId}`);
    return response.data.data;
  }
);

const scoreListSlice = createSlice({
  name: 'scoreList',
  initialState: {
    examName: '',
    results: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchScoreList.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchScoreList.fulfilled, (state, action) => {
        state.loading = false;
        state.examName = action.payload.examName;
        state.results = action.payload.results;
      })
      .addCase(fetchScoreList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default scoreListSlice.reducer;
