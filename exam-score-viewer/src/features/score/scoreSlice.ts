// scoreSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { fetchScoresByExamId } from '../../api/scoreApi';

interface Score {
  studentId: string;
  studentName: string;
  score: number;
  submittedAt: string;
}

interface ScoreState {
  examName: string;
  results: Score[];
  loading: boolean;
  error: string | null;
}

const initialState: ScoreState = {
  examName: '',
  results: [],
  loading: false,
  error: null,
};

export const fetchScores = createAsyncThunk(
  'score/fetchScores',
  async (examId: string, thunkAPI) => {
    try {
      const data = await fetchScoresByExamId(examId);
      return data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.message || 'Failed to fetch scores');
    }
  }
);

// 🧩 Slice xử lý reducer + loading + error
const scoreSlice = createSlice({
  name: 'score',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchScores.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchScores.fulfilled, (state, action: PayloadAction<{ examName: string; results: Score[] }>) => {
        state.loading = false;
        state.examName = action.payload.examName;
        state.results = action.payload.results;
      })
      .addCase(fetchScores.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default scoreSlice.reducer;
