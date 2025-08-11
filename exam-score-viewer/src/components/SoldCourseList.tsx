// src/components/SoldCourseList.tsx
import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../hooks/reduxHooks';
import { fetchSoldCourseList } from '../features/soldCourse/soldCourseThunks';
import SoldCourseChart from './SoldCourseChart';
import {
  selectSoldCoursesAggregated,
  selectSoldCoursesLoading,
  selectSoldCoursesError,
} from '../features/soldCourse/soldCourseSelectors';

const SoldCourseList: React.FC = () => {
  const dispatch = useAppDispatch();
  const aggregated = useAppSelector(selectSoldCoursesAggregated);
  const loading = useAppSelector(selectSoldCoursesLoading);
  const error = useAppSelector(selectSoldCoursesError);

  useEffect(() => {
    dispatch(fetchSoldCourseList());
  }, [dispatch]);

  if (loading) return <div className="text-center text-blue-600 text-xl py-12">Đang tải dữ liệu...</div>;
  if (error) return <div className="text-center text-red-600 text-xl py-12">Lỗi: {error}</div>;

  return (
    <div className="max-w-[85%] mx-auto mt-10 mb-16">
      <h2 className="text-4xl font-bold text-blue-600 mb-8 text-center">
        Thống kê các khóa học đã bán
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Chart */}
        <SoldCourseChart data={aggregated} />

        {/* Table */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-2xl font-semibold mb-5 text-blue-600">Chi tiết bán hàng</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-lg">
              <thead className="bg-blue-600 text-white">
                <tr>
                  <th className="px-5 py-3 text-left">ID</th>
                  <th className="px-5 py-3 text-left">Tên khóa học</th>
                  <th className="px-5 py-3 text-right">Giá (VNĐ)</th>
                  <th className="px-5 py-3 text-right">Số lượng</th>
                </tr>
              </thead>
              <tbody>
                {aggregated.map((c) => (
                  <tr key={c.id} className="border-b hover:bg-blue-50 text-base">
                    <td className="px-5 py-4">{c.id}</td>
                    <td className="px-5 py-4">{c.name}</td>
                    <td className="px-5 py-4 text-right font-medium">{c.price?.toLocaleString()}</td>
                    <td className="px-5 py-4 text-right font-bold">{c.count}</td>
                  </tr>
                ))}
                {aggregated.length === 0 && (
                  <tr>
                    <td colSpan={4} className="text-center py-8 text-gray-500 text-lg">
                      Không có dữ liệu
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SoldCourseList;
