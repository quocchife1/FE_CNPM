// AuditLogList.tsx
import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../hooks/reduxHooks';
import {
  fetchAuditLogsThunk,
  selectAuditLogs,
  selectAuditLoading,
} from '../features/auditLog';
import './AuditLogList.css';

const AuditLogList: React.FC = () => {
  const dispatch = useAppDispatch();
  const logs = useAppSelector(selectAuditLogs);
  const loading = useAppSelector(selectAuditLoading);

  const [keyword, setKeyword] = useState('');
  const [userFilter, setUserFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [sort] = useState('id,desc');

  useEffect(() => {
    dispatch(fetchAuditLogsThunk({ page, size, sort }));
  }, [dispatch, page, size, sort]);

  const filteredLogs = logs.filter((log) => {
    const matchesKeyword =
      log.action?.toLowerCase().includes(keyword.toLowerCase()) ||
      log.path?.toLowerCase().includes(keyword.toLowerCase()) ||
      log.method?.toLowerCase().includes(keyword.toLowerCase()) ||
      log.username?.toLowerCase().includes(keyword.toLowerCase()) ||
      log.ipAddress?.includes(keyword) ||
      log.statusCode?.toString().includes(keyword);

    const matchesUser = userFilter ? log.username === userFilter : true;
    const matchesStatus = statusFilter ? log.statusCode?.toString() === statusFilter : true;

    return matchesKeyword && matchesUser && matchesStatus;
  });

  const handleClear = () => {
    setKeyword('');
    setUserFilter('');
    setStatusFilter('');
  };

  const handleSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    if (value === 'all') {
      setSize(1000);
      setPage(0);
    } else {
      setSize(parseInt(value));
      setPage(0);
    }
  };

  return (
    <div className="audit-page">
      <h2 className="audit-title">📜 Nhật ký hệ thống</h2>

      <div className="filters">
        <input
          type="text"
          placeholder="Nhập từ khóa"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
        />

        <input
          type="text"
          placeholder="Lọc theo người dùng"
          value={userFilter}
          onChange={(e) => setUserFilter(e.target.value)}
        />

        <input
          type="text"
          placeholder="Lọc theo status code"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        />

        <select value={size >= 1000 ? 'all' : size} onChange={handleSizeChange}>
          <option value="10">10 / trang</option>
          <option value="50">50 / trang</option>
          <option value="100">100 / trang</option>
          <option value="all">Tất cả</option>
        </select>

        <button
          onClick={() => {
            setPage(0);
            dispatch(fetchAuditLogsThunk({ page: 0, size, sort }));
          }}
        >
          Lọc dữ liệu
        </button>

        <button className="clear" onClick={handleClear}>
          Xóa trắng
        </button>
      </div>

      {loading ? (
        <p className="loading">Đang tải...</p>
      ) : (
        <div style={{ minHeight: '60vh' }}>
          <table className="audit-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Người dùng</th>
                <th>Hành động</th>
                <th>Phương thức</th>
                <th>Đường dẫn</th>
                <th>IP</th>
                <th>Status</th>
                <th>Thời gian</th>
              </tr>
            </thead>
            <tbody>
              {filteredLogs.length > 0 ? (
                filteredLogs.map((log, index) => (
                  <tr key={index}>
                    <td>{log.id}</td>
                    <td>{log.username}</td>
                    <td>{log.action}</td>
                    <td>{log.method}</td>
                    <td>{log.path}</td>
                    <td>{log.ipAddress}</td>
                    <td>{log.statusCode}</td>
                    <td>{new Date(log.timestamp).toLocaleString('vi-VN')}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} style={{ textAlign: 'center', padding: '20px' }}>
                    Không có dữ liệu phù hợp
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          {/* Phân trang */}
          <div className="pagination">
            <button onClick={() => setPage((p) => Math.max(p - 1, 0))} disabled={page === 0}>
              Trang trước
            </button>
            <span> {page + 1}</span>
            <button
              onClick={() => setPage((p) => p + 1)}
              disabled={logs.length < size}
            >
              Trang sau
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AuditLogList;
