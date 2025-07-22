// scoreThunks.ts
import { createAsyncThunk } from '@reduxjs/toolkit';
import { fetchScoresByExamId } from '../../api/scoreApi';

export const fetchScoreList = createAsyncThunk(
  'score/fetchScoreList',
  async (examId: string) => {
    const data = await fetchScoresByExamId(examId);
    return data;
  }
);