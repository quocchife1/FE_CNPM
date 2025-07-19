import { createAsyncThunk } from '@reduxjs/toolkit';
import { fetchAuditLogs } from '../../api/auditLogApi';

export const fetchAuditLogsThunk = createAsyncThunk(
  'auditLog/fetchAuditLogs',
  async () => {
    // const data = await fetchAuditLogs();
    // return data;
    const response = await fetch('/mockAuditLogs.json');
    return await response.json();
  }
);
