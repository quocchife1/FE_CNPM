// exam-score-viewer/src/components/SoldCourseList.tsx
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchSoldCourseList } from '../features/soldCourse/soldCourseSlice';
import {
  selectSoldCourses,
  selectSoldCoursesLoading,
  selectSoldCoursesError,
} from '../features/soldCourse/soldCourseSelectors';

const SoldCourseList: React.FC = () => {
  const dispatch = useDispatch<any>();
  const courses = useSelector(selectSoldCourses);
  const loading = useSelector(selectSoldCoursesLoading);
  const error = useSelector(selectSoldCoursesError);

  useEffect(() => {
    dispatch(fetchSoldCourseList());
  }, [dispatch]);

  if (loading) return <p className="text-center text-blue-600">Đang tải dữ liệu...</p>;
  if (error) return <p className="text-center text-red-600">Lỗi: {error}</p>;

  return (
    <div className="max-w-[80%] mx-auto mt-6">
      <h2 className="text-3xl font-bold text-blue-500 mb-4">Khóa học đã mua</h2>
      <div className="shadow-md rounded-lg border border-gray-200 overflow-hidden">
        <table className="w-full text-sm text-left">
          <thead className="bg-blue-500 text-white">
            <tr>
              <th className="px-4 py-3">STT</th>
              <th className="px-4 py-3">Tên khóa học</th>
              <th className="px-4 py-3">Giá bán (VNĐ)</th>
            </tr>
          </thead>
          <tbody className="bg-white text-gray-800">
            {courses.map((course, index) => (
              <tr key={index} className="border-t hover:bg-blue-50 transition-all">
                <td className="px-4 py-3">{index + 1}</td>
                <td className="px-4 py-3">{course.name}</td>
                <td className="px-4 py-3">{course.price.toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SoldCourseList;
