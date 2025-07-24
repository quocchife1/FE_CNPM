import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../hooks/reduxHooks';
import {
  fetchAuditLogsThunk,
  selectAuditLogs,
  selectAuditLoading,
} from '../features/auditLog';

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
    <div className="min-h-screen bg-white text-gray-900 px-5 py-10">
      <h2 className="text-3xl font-bold text-blue-500 mb-6">Nhật ký hệ thống</h2>

      <div className="flex flex-wrap gap-3 mb-5">
        <input
          type="text"
          placeholder="Nhập từ khóa"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          className="px-3 py-2 border border-blue-500 rounded-md text-sm"
        />

        <input
          type="text"
          placeholder="Lọc theo người dùng"
          value={userFilter}
          onChange={(e) => setUserFilter(e.target.value)}
          className="px-3 py-2 border border-blue-500 rounded-md text-sm"
        />

        <input
          type="text"
          placeholder="Lọc theo status code"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2 border border-blue-500 rounded-md text-sm"
        />

        <select
          value={size >= 1000 ? 'all' : size}
          onChange={handleSizeChange}
          className="px-3 py-2 border border-blue-500 rounded-md text-sm"
        >
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
          className="bg-blue-500 text-white font-semibold px-4 py-2 rounded-md hover:opacity-90"
        >
          Lọc dữ liệu
        </button>

        <button
          onClick={handleClear}
          className="bg-red-500 text-white font-semibold px-4 py-2 rounded-md hover:opacity-90"
        >
          Xóa trắng
        </button>
      </div>

      {loading ? (
        <p className="italic text-blue-300 text-sm">Đang tải...</p>
      ) : (
        <div className="min-h-[60vh]">
          <table className="w-full table-fixed border-collapse shadow-lg rounded-lg overflow-hidden font-sans [font-feature-settings:'tnum']">
            <thead>
              <tr className="bg-blue-500 text-white text-center">
                <th className="p-3 w-[5%] text-left">ID</th>
                <th className="p-3 w-[15%] text-left">Người dùng</th>
                <th className="p-3 w-[20%] text-left">Hành động</th>
                <th className="p-3 w-[10%] text-left">Phương thức</th>
                <th className="p-3 w-[15%] text-left">Đường dẫn</th>
                <th className="p-3 w-[15%] text-left">IP</th>
                <th className="p-3 w-[10%] text-left">Status</th>
                <th className="p-3 w-[20%] text-left">Thời gian</th>
              </tr>
            </thead>
            <tbody>
              {filteredLogs.length > 0 ? (
                filteredLogs.map((log, index) => (
                  <tr
                    key={index}
                    className="hover:bg-blue-100 border-b text-left"
                  >
                    <td className="p-3 w-[5%]">{log.id}</td>
                    <td className="p-3 w-[15%]">{log.username}</td>
                    <td className="p-3 w-[20%]">{log.action}</td>
                    <td className="p-3 w-[10%]">{log.method}</td>
                    <td className="p-3 w-[15%]">{log.path}</td>
                    <td className="p-3 w-[15%]">{log.ipAddress}</td>
                    <td className="p-3 w-[10%]">{log.statusCode}</td>
                    <td className="p-3 w-[20%]">
                      {new Date(log.timestamp).toLocaleString('vi-VN')}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="text-center py-6 text-gray-500">
                    Không có dữ liệu phù hợp
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          <div className="flex justify-center items-center gap-4 mt-6">
            <button
              onClick={() => setPage((p) => Math.max(p - 1, 0))}
              disabled={page === 0}
              className="px-4 py-2 bg-blue-500 text-white rounded-md disabled:bg-gray-300"
            >
              Trang trước
            </button>
            <span className="text-blue-500 font-semibold text-lg">{page + 1}</span>
            <button
              onClick={() => setPage((p) => p + 1)}
              disabled={logs.length < size}
              className="px-4 py-2 bg-blue-500 text-white rounded-md disabled:bg-gray-300"
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
