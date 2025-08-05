// exam-score-viewer/src/api/auditLogApi.ts
import axios from 'axios';

axios.defaults.withCredentials = true;

const API_URL = process.env.REACT_APP_API_URL!;

interface AuditLog {
  id: number;
  username: string;
  action: string;
  method: string;
  path: string;
  ipAddress: string;
  statusCode: number;
  timestamp: string;
}

interface FetchAuditLogsParams {
  page: number;
  size: number;
  sort: string;
}

export const fetchAuditLogs = async ({ page, size, sort }: FetchAuditLogsParams) => {
  const response = await axios.get(`${API_URL}/activity-logs`, {
    params: { page, size, sort },
  });

  return {
    data: response.data.result as AuditLog[],
    meta: response.data.meta,
  };
};

export const fetchAllAuditLogs = async (): Promise<AuditLog[]> => {
  console.log('Bắt đầu lấy tất cả nhật ký...');
  const initialFetchSize = 1000;
  const firstPageResponse = await fetchAuditLogs({ page: 0, size: initialFetchSize, sort: 'id,asc' });
  const meta = firstPageResponse.meta;

  if (!meta || meta.totalElements === 0) {
    console.log('Không có meta hoặc totalElements = 0. Trả về mảng rỗng.');
    return [];
  }

  let allLogs: AuditLog[] = [];
  if (firstPageResponse.data && firstPageResponse.data.length > 0) {
    allLogs.push(...firstPageResponse.data);
  }

  const remainingElements = meta.totalElements - allLogs.length;
  if (remainingElements <= 0) {
    console.log(`Đã lấy thành công ${allLogs.length} bản ghi (chỉ từ trang đầu tiên).`);
    return allLogs;
  }

  const BATCH_SIZE = 500;
  const numberOfAdditionalPages = Math.ceil(remainingElements / BATCH_SIZE);

  const promises = [];
  for (let page = 1; page <= numberOfAdditionalPages; page++) {
    promises.push(fetchAuditLogs({ page, size: BATCH_SIZE, sort: 'id,asc' }));
  }

  try {
    const results = await Promise.all(promises);

    results.forEach(result => {
      if (result.data) {
        allLogs.push(...result.data);
      }
    });

    console.log(`Đã lấy thành công ${allLogs.length} bản ghi.`);
    return allLogs;
  } catch (error) {
    console.error("Lỗi khi fetch tất cả nhật ký:", error);
    throw error;
  }
};
