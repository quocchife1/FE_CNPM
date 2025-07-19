import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../hooks/reduxHooks';
import {
  fetchAuditLogsThunk,
  selectAuditLogs,
  selectAuditLoading,
} from '../features/auditLog';
import './AuditLogList.css';

const PAGE_SIZE = 20;

const AuditLogList: React.FC = () => {
  const dispatch = useAppDispatch();
  const logs = useAppSelector(selectAuditLogs);
  const loading = useAppSelector(selectAuditLoading);

  const [currentPage, setCurrentPage] = useState(1);
  const [keyword, setKeyword] = useState('');
  const [userFilter, setUserFilter] = useState('');
  const [moduleFilter, setModuleFilter] = useState('');

  useEffect(() => {
    dispatch(fetchAuditLogsThunk());
  }, [dispatch]);

  const filteredLogs = logs.filter((log) => {
    const matchesKeyword =
      log.module.includes(keyword) ||
      log.action.includes(keyword) ||
      log.description.includes(keyword) ||
      log.username.includes(keyword);

    const matchesUser = userFilter ? log.username === userFilter : true;
    const matchesModule = moduleFilter ? log.module === moduleFilter : true;

    return matchesKeyword && matchesUser && matchesModule;
  });

  const totalPages = Math.ceil(filteredLogs.length / PAGE_SIZE);
  const paginatedLogs = filteredLogs.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  const handleClear = () => {
    setKeyword('');
    setUserFilter('');
    setModuleFilter('');
    setCurrentPage(1);
  };

  const handleDelete = (logId: number) => {
    console.log('Xóa log có ID:', logId);
    // Nếu có API: dispatch(deleteAuditLogThunk(logId));
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const nextPage = () => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
  };

  const prevPage = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
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

        <select value={userFilter} onChange={(e) => setUserFilter(e.target.value)}>
          <option value="">-- Lọc theo người thực hiện --</option>
          <option value="admin">admin</option>
          <option value="system">system</option>
        </select>

        <select value={moduleFilter} onChange={(e) => setModuleFilter(e.target.value)}>
          <option value="">-- Lọc theo module --</option>
          <option value="login">Login</option>
          <option value="Sản phẩm">Sản phẩm</option>
        </select>

        <button onClick={() => setCurrentPage(1)}>Lọc dữ liệu</button>
        <button className="clear" onClick={handleClear}>Xóa trắng</button>
      </div>

      {loading ? (
        <p className="loading">Đang tải...</p>
      ) : (
        <>
          <table className="audit-table">
            <thead>
              <tr>
                <th>Module</th>
                <th>Tên sự kiện</th>
                <th>Ghi chú</th>
                <th>ID người dùng</th>
                <th>Người thực hiện</th>
                <th>Thời gian</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {paginatedLogs.map((log, index) => (
                <tr key={index}>
                  <td>{log.module}</td>
                  <td>{log.action}</td>
                  <td>{log.description}</td>
                  <td>{log.userId}</td>
                  <td>{log.username}</td>
                  <td>{new Date(log.timestamp).toLocaleString('vi-VN')}</td>
                  <td>
                    <button
                      className="delete-btn"
                      onClick={() => handleDelete(log.id)}
                    >
                      🗑️ Xóa
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="pagination">
            <button onClick={prevPage} disabled={currentPage === 1}>
              ← Trang trước
            </button>
            <span>
              Trang {currentPage} / {totalPages}
            </span>
            <button onClick={nextPage} disabled={currentPage === totalPages}>
              Trang sau →
            </button>
          </div>
        </>
      )}

      {/* Nút trở về đầu trang */}
      <button className="scroll-top-btn" onClick={scrollToTop}>
        ⬆
      </button>
    </div>
  );
};

export default AuditLogList;
