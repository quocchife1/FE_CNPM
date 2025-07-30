import React, { useEffect, useMemo, useState, useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '../hooks/reduxHooks';
import {
  fetchAllAuditLogsThunk,
  selectAllAuditLogs,
  selectAuditLoading,
} from '../features/auditLog';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { AuditLog } from '../types/auditLog';
import { Link } from 'react-router-dom';

type TimeFrame = 'month' | 'quarter' | 'year';


const getDaysInMonth = (year: number, month: number) => {
  const date = new Date(year, month, 1);
  const days = [];
  while (date.getMonth() === month) {
    days.push(date.toLocaleDateString('vi-VN', { day: '2-digit' }));
    date.setDate(date.getDate() + 1);
  }
  return days;
};

const getQuarter = (date: Date) => {
  return Math.floor(date.getMonth() / 3) + 1;
};


const toYYYYMMDD = (date: Date): string => {
    return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
};

const LoginStatsDashboard: React.FC = () => {
  const dispatch = useAppDispatch();
  const allLogs = useAppSelector(selectAllAuditLogs);
  const loading = useAppSelector(selectAuditLoading);

  const [timeFrame, setTimeFrame] = useState<TimeFrame>('month'); // Mặc định là 'month'
  const [selectedMonth, setSelectedMonth] = useState(() => new Date().getMonth()); // 0-indexed
  const [selectedYear, setSelectedYear] = useState(() => new Date().getFullYear());

  const [selectedDateLogs, setSelectedDateLogs] = useState<AuditLog[]>([]);
  const [currentDetailedDay, setCurrentDetailedDay] = useState<string | null>(null); // Dạng "DD"

  useEffect(() => {
    dispatch(fetchAllAuditLogsThunk());
  }, [dispatch]);

  useEffect(() => {
    if (allLogs.length > 0 && timeFrame === 'month') {
      const today = new Date();
      const todayDay = today.getDate().toString().padStart(2, '0');
      setSelectedMonth(today.getMonth());
      setSelectedYear(today.getFullYear());
      setCurrentDetailedDay(todayDay);
    }
  }, [allLogs, timeFrame]);

  useEffect(() => {
    if (currentDetailedDay && allLogs.length > 0) {
      const targetDateStr = toYYYYMMDD(new Date(selectedYear, selectedMonth, parseInt(currentDetailedDay)));

      const filtered = allLogs.filter(log => {
        const logDate = new Date(log.timestamp);
        const logDateStr = toYYYYMMDD(logDate);
        
        return (
          log.action === 'Đăng nhập thành công' &&
          logDateStr === targetDateStr
        );
      });
      setSelectedDateLogs(filtered);
    } else {
      setSelectedDateLogs([]);
    }
  }, [allLogs, currentDetailedDay, selectedMonth, selectedYear]);


  const chartData = useMemo(() => {
    if (!allLogs || allLogs.length === 0) {
      return [];
    }

    const loginLogs = allLogs.filter(
      (log) => log.action === 'Đăng nhập thành công'
    );

    const groupedData: Record<string, number> = {};
    let initialKeys: string[] = [];
    let totalLoginsForYear = 0;

    if (timeFrame === 'month') {
      initialKeys = getDaysInMonth(selectedYear, selectedMonth);
      initialKeys.forEach(day => (groupedData[day] = 0));
    } else if (timeFrame === 'quarter') {
      initialKeys = ['Quý 1', 'Quý 2', 'Quý 3', 'Quý 4'];
      initialKeys.forEach(quarter => (groupedData[quarter] = 0));
    } else if (timeFrame === 'year') {
      loginLogs.forEach(log => {
        const date = new Date(log.timestamp);
        if (date.getFullYear() === selectedYear) {
          totalLoginsForYear++;
        }
      });
      return [{ name: selectedYear.toString(), 'Số lượt đăng nhập': totalLoginsForYear }];
    }

    loginLogs.forEach(log => {
      const date = new Date(log.timestamp);
      let key = '';

      if (timeFrame === 'month') {
        if (date.getMonth() === selectedMonth && date.getFullYear() === selectedYear) {
          key = date.toLocaleDateString('vi-VN', { day: '2-digit' }); // Chỉ lấy số ngày
          groupedData[key] = (groupedData[key] || 0) + 1;
        }
      } else if (timeFrame === 'quarter') {
        if (date.getFullYear() === selectedYear) {
          const quarter = getQuarter(date);
          key = `Quý ${quarter}`;
          groupedData[key] = (groupedData[key] || 0) + 1;
        }
      }
    });

    const sortedKeys = Object.keys(groupedData).sort((a, b) => {
      if (timeFrame === 'month') {
        return parseInt(a) - parseInt(b);
      }
      return a.localeCompare(b);
    });

    return sortedKeys.map(key => ({
      name: key,
      'Số lượt đăng nhập': groupedData[key],
    }));

  }, [allLogs, timeFrame, selectedMonth, selectedYear]);

  const handleMonthYearChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const [year, month] = event.target.value.split('-').map(Number);
    setSelectedYear(year);
    setSelectedMonth(month - 1);
    
    const newDate = new Date(year, month - 1, 1);
    const today = new Date();
    if (newDate.getFullYear() === today.getFullYear() && newDate.getMonth() === today.getMonth()) {
      setCurrentDetailedDay(today.getDate().toString().padStart(2, '0'));
    } else {
      setCurrentDetailedDay('01'); 
    }
  };

  const availableYears = useMemo(() => {
    const years = new Set<number>();
    allLogs.forEach(log => {
      const year = new Date(log.timestamp).getFullYear();
      years.add(year);
    });
    const sortedYears = Array.from(years).sort((a, b) => b - a);
    if (!sortedYears.includes(new Date().getFullYear())) {
      sortedYears.unshift(new Date().getFullYear());
    }
    return sortedYears;
  }, [allLogs]);

  const [currentYearForStats, setCurrentYearForStats] = useState(() => new Date().getFullYear());
  useEffect(() => {
    setSelectedYear(currentYearForStats);
  }, [currentYearForStats]);

  const handleBarClick = useCallback((data: any) => {
    if (timeFrame === 'month') {
      setCurrentDetailedDay(data.name);
    }
  }, [timeFrame]);

  return (
    <div className="min-h-screen bg-white text-gray-900 px-5 py-10">
      <h2 className="text-3xl font-bold text-blue-500 mb-6">Thống kê đăng nhập</h2>

      {loading && allLogs.length === 0 ? (
        <p className="italic text-blue-300 text-sm">Đang tải dữ liệu thống kê...</p>
      ) : (
        <>
          <div className="flex flex-wrap gap-4 mb-8 items-center">
            <button 
              onClick={() => { 
                setTimeFrame('month'); 
                const today = new Date();
                setSelectedMonth(today.getMonth());
                setSelectedYear(today.getFullYear());
                setCurrentDetailedDay(today.getDate().toString().padStart(2, '0')); 
              }} 
              className={`px-4 py-2 rounded-md font-semibold ${timeFrame === 'month' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}>
              Theo tháng
            </button>
            <button onClick={() => { setTimeFrame('quarter'); setCurrentDetailedDay(null); }} className={`px-4 py-2 rounded-md font-semibold ${timeFrame === 'quarter' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}>Theo quý</button>
            <button onClick={() => { setTimeFrame('year'); setCurrentDetailedDay(null); }} className={`px-4 py-2 rounded-md font-semibold ${timeFrame === 'year' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}>Theo năm</button>

            {(timeFrame === 'month') && (
              <input
                type="month"
                value={`${selectedYear}-${(selectedMonth + 1).toString().padStart(2, '0')}`}
                onChange={handleMonthYearChange}
                className="px-3 py-2 border border-blue-500 rounded-md text-sm"
              />
            )}

            {(timeFrame === 'quarter' || timeFrame === 'year') && (
              <select
                value={currentYearForStats}
                onChange={(e) => setCurrentYearForStats(parseInt(e.target.value))}
                className="px-3 py-2 border border-blue-500 rounded-md text-sm"
              >
                {availableYears.map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            )}

            <Link to="/auditlogs">
              <button className="bg-gray-600 text-white font-semibold px-4 py-2 rounded-md hover:opacity-90">
                &larr; Trở về nhật ký hệ thống
              </button>
            </Link>
          </div>

          {timeFrame === 'year' ? (
            <div className="flex justify-center items-center h-[300px] flex-col">
              <p className="text-gray-500 text-lg mb-2">Tổng số lượt đăng nhập năm {selectedYear}:</p>
              <p className={`text-6xl font-bold ${chartData[0]?.['Số lượt đăng nhập'] > 0 ? 'text-blue-600' : 'text-gray-400'}`}>
                {chartData[0]?.['Số lượt đăng nhập'] || 0}
              </p>
            </div>
          ) : (
            <div className="bg-gray-50 p-4 rounded-lg shadow-md mb-8">
              {chartData.length > 0 && chartData.some(d => d['Số lượt đăng nhập'] > 0) ? (
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart
                    data={chartData}
                    margin={{
                      top: 5,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis allowDecimals={false} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="Số lượt đăng nhập" fill="#3B82F6" onClick={handleBarClick} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex justify-center items-center h-full" style={{ height: 400 }}>
                  <p className="text-center text-gray-500">Không có dữ liệu đăng nhập để thống kê.</p>
                </div>
              )}
            </div>
          )}

          {timeFrame === 'month' && currentDetailedDay && (
            <div className="mt-8">
              <h3 className="text-2xl font-bold text-blue-700 mb-4">
                Chi tiết đăng nhập ngày {currentDetailedDay}/{(selectedMonth + 1).toString().padStart(2, '0')}/{selectedYear}
              </h3>
              <div className="overflow-x-auto rounded-xl shadow-lg">
                <table className="w-full border-collapse bg-white text-gray-800 text-base">
                  <thead className="bg-blue-700 text-white">
                    <tr>
                      <th className="p-4 text-center">ID</th>
                      <th className="p-4 text-center">Người dùng</th>
                      <th className="p-4 text-center">Hành động</th>
                      <th className="p-4 text-center">Phương thức</th>
                      <th className="p-4 text-center">Đường dẫn</th>
                      <th className="p-4 text-center">IP</th>
                      <th className="p-4 text-center">Status</th>
                      <th className="p-4 text-center">Thời gian</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedDateLogs.length > 0 ? (
                      selectedDateLogs.map((log, index) => (
                        <tr
                          key={index}
                          className={`transition-colors duration-100 ${
                            index % 2 === 1 ? 'bg-blue-50' : ''
                          } hover:bg-blue-100`}
                        >
                          <td className="p-4 text-center">{log.id}</td>
                          <td className="p-4 text-center">{log.username}</td>
                          <td className="p-4 text-center">{log.action}</td>
                          <td className="p-4 text-center">{log.method}</td>
                          <td className="p-4 text-center">{log.path}</td>
                          <td className="p-4 text-center">{log.ipAddress}</td>
                          <td className="p-4 text-center">{log.statusCode}</td>
                          <td className="p-4 text-center">
                            {new Date(log.timestamp).toLocaleString('vi-VN')}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={8} className="text-center py-6 text-gray-500">
                          Không có lượt đăng nhập nào vào ngày này.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default LoginStatsDashboard;