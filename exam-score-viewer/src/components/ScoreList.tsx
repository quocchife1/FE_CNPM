import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../hooks/reduxHooks';
import { fetchScores } from '../features/score/scoreSlice';
import { formatScore } from '../utils/formatScore';
import ScoreChart from '../components/ScoreChart';

function ScoreList() {
  const { examId } = useParams<{ examId: string }>();
  const dispatch = useAppDispatch();
  const { examName, results, loading, error } = useAppSelector((state) => state.score);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [showChart, setShowChart] = useState(false);

  useEffect(() => {
    if (examId) {
      dispatch(fetchScores(examId));
    }
  }, [dispatch, examId]);

  const totalPages = Math.ceil(results.length / itemsPerPage);
  const paginatedResults = results.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  if (loading) return <p className="text-center text-lg">Đang tải dữ liệu...</p>;
  if (error) return <p className="text-center text-red-500">❌ Lỗi: {error}</p>;

  return (
    <div className="min-h-screen px-10 pb-12 pt-6 bg-gradient-to-b from-blue-100 to-blue-200 transition-transform hover:-translate-y-1">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-bold text-blue-900 text-center w-full drop-shadow-sm">
          Kết quả kỳ thi: {examName}
        </h2>
        <button
          className="absolute right-10 bg-blue-700 text-white font-bold py-2 px-4 rounded-md hover:bg-blue-900 transition"
          onClick={() => setShowChart((prev) => !prev)}
        >
          {showChart ? 'Trở về bảng điểm' : 'Xem biểu đồ'}
        </button>
      </div>

      {showChart ? (
        <div className="bg-white rounded-lg shadow-md p-4">
          <ScoreChart
            data={results.map((item) => ({
              name: `${item.studentName} (${item.studentId})`,
              score: item.score,
            }))}
          />
        </div>
      ) : (
        <>
          <div className="overflow-x-auto rounded-xl shadow-lg">
            <table className="w-full border-collapse bg-white text-gray-800 text-base">
              <thead className="bg-blue-700 text-white">
                <tr>
                  <th className="p-4 text-center">STT</th>
                  <th className="p-4 text-center">Mã học sinh</th>
                  <th className="p-4 text-center">Học sinh</th>
                  <th className="p-4 text-center">Điểm</th>
                  <th className="p-4 text-center">Thời gian nộp</th>
                </tr>
              </thead>
              <tbody>
                {paginatedResults.map((item, index) => (
                  <tr
                    key={item.studentId}
                    className={`transition-colors duration-100 ${
                      index % 2 === 1 ? 'bg-blue-50' : ''
                    } hover:bg-blue-100`}
                  >
                    <td className="p-4 text-center">{(currentPage - 1) * itemsPerPage + index + 1}</td>
                    <td className="p-4 text-center">{item.studentId}</td>
                    <td className="p-4 text-center">{item.studentName}</td>
                    <td className="p-4 text-center italic text-gray-600">
                      {formatScore(item.score)}
                    </td>
                    <td className="p-4 text-center">
                      {new Date(item.submittedAt).toLocaleString('vi-VN')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-6">
              <button
                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 rounded-md border font-bold text-blue-700 border-blue-700 hover:bg-blue-700 hover:text-white disabled:opacity-50"
              >
                ← Trang trước
              </button>

              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i + 1}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`px-4 py-2 rounded-md border font-bold ${
                    currentPage === i + 1
                      ? 'bg-blue-700 text-white'
                      : 'border-blue-700 text-blue-700 hover:bg-blue-700 hover:text-white'
                  }`}
                >
                  {i + 1}
                </button>
              ))}

              <button
                onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-4 py-2 rounded-md border font-bold text-blue-700 border-blue-700 hover:bg-blue-700 hover:text-white disabled:opacity-50"
              >
                Trang sau →
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default ScoreList;
