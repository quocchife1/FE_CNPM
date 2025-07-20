//auditLogThunks.ts
import { createAsyncThunk } from '@reduxjs/toolkit';
import { fetchAuditLogs } from '../../api/auditLogApi';

export const fetchAuditLogsThunk = createAsyncThunk(
  'auditLog/fetchAuditLogs',
  async ({
    page,
    size,
    sort,
  }: {
    page: number;
    size: number;
    sort: string;
  }) => {
    const response = await fetchAuditLogs({ page, size, sort });
    return response;
  }
);