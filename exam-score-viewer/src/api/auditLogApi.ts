  // exam-score-viewer/src/api/auditLogApi.ts
  import axios from 'axios';

  axios.defaults.withCredentials = true;

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

  // Giữ nguyên hàm này, nó hoạt động đúng
  export const fetchAuditLogs = async ({ page, size, sort }: FetchAuditLogsParams) => {
    const response = await axios.get('/api/v1/activity-logs', {
      params: { page, size, sort },
    });

    // LOG để kiểm tra response từ mỗi lần gọi fetchAuditLogs
    console.log(`API Response for page ${page}, size ${size}:`, response.data);

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
    // Thêm dữ liệu từ trang đầu tiên vào allLogs
    if (firstPageResponse.data && firstPageResponse.data.length > 0) {
      allLogs.push(...firstPageResponse.data);
    }

    // Tính toán số lượng trang còn lại cần fetch
    // Nếu totalElements <= initialFetchSize, không cần fetch thêm
    const remainingElements = meta.totalElements - allLogs.length;
    if (remainingElements <= 0) {
        console.log(`Đã lấy thành công ${allLogs.length} bản ghi (chỉ từ trang đầu tiên).`);
        return allLogs;
    }

    const BATCH_SIZE = 500; // Kích thước batch cho các yêu cầu tiếp theo
    // Tính toán số trang bổ sung cần fetch, bắt đầu từ trang tiếp theo (page 1)
    const numberOfAdditionalPages = Math.ceil(remainingElements / BATCH_SIZE);

    const promises = [];
    // Bắt đầu từ page 1 vì page 0 đã được fetch ở trên
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