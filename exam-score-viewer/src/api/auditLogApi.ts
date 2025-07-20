// auditLogApi.ts
import axios from 'axios';

interface FetchAuditLogsParams {
  page: number;
  size: number;
  sort: string;
}

export const fetchAuditLogs = async ({ page, size, sort }: FetchAuditLogsParams) => {
  const response = await axios.get('/api/v1/activity-logs', {
    params: { page, size, sort },
  });

  return {
    data: response.data.result,  // ✅ lấy từ `response.data.result`
    meta: response.data.meta,    // ✅ lấy từ `response.data.meta`
  };
};