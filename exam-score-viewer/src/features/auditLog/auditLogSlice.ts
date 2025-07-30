// src/features/auditLog/auditLogSlice.ts

import { createSlice } from '@reduxjs/toolkit';
import { fetchAuditLogsThunk, fetchAllAuditLogsThunk } from './auditLogThunks';

interface AuditLogState {
  logs: any[];
  allLogs: any[];
  meta: any;
  loading: boolean;
  error: string | null;
}

const initialState: AuditLogState = {
  logs: [],
  allLogs: [],
  meta: null,
  loading: false,
  error: null,
};

const auditLogSlice = createSlice({
  name: 'auditLog',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAuditLogsThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAuditLogsThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.logs = action.payload.data;
        state.meta = action.payload.meta;
      })
      .addCase(fetchAuditLogsThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Error loading logs';
      })

      .addCase(fetchAllAuditLogsThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllAuditLogsThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.allLogs = action.payload;
      })
      .addCase(fetchAllAuditLogsThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Error loading all logs';
        console.error("Lỗi tải tất cả nhật ký:", action.error);
      });
  },
});

export default auditLogSlice.reducer;