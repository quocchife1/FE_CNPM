// src/features/auditLog/auditLogThunks.ts

import { createAsyncThunk } from '@reduxjs/toolkit';
import { fetchAuditLogs, fetchAllAuditLogs } from '../../api/auditLogApi';

export const fetchAuditLogsThunk = createAsyncThunk(
  'auditLog/fetchAuditLogs',
  async ({ page, size, sort }: { page: number; size: number; sort: string; }) => {
    const response = await fetchAuditLogs({ page, size, sort });
    return response;
  }
);

export const fetchAllAuditLogsThunk = createAsyncThunk(
  'auditLog/fetchAllAuditLogs',
  async () => {
    const response = await fetchAllAuditLogs();
    return response;
  }
);