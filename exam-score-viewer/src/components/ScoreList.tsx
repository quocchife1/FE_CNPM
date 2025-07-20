//ScoreList.tsx
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../hooks/reduxHooks';
import { fetchScores } from '../features/score/scoreSlice';
import { formatScore } from '../utils/formatScore';
import './ScoreList.css';

function ScoreList() {
  const { examId } = useParams<{ examId: string }>();
  const dispatch = useAppDispatch();

  const { examName, results, loading, error } = useAppSelector((state) => state.score);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

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

  if (loading) return <p>Đang tải dữ liệu...</p>;
  if (error) return <p>❌ Lỗi: {error}</p>;

  return (
    <div className="score-container">
      <h2 className="score-title">Kết quả kỳ thi: {examName}</h2>
      <table className="score-table">
        <thead>
          <tr>
            <th>STT</th>
            <th>Học sinh</th>
            <th>Điểm</th>
            <th>Thời gian nộp</th>
          </tr>
        </thead>
        <tbody>
          {paginatedResults.map((item, index) => (
            <tr key={item.studentId}>
              <td>{(currentPage - 1) * itemsPerPage + index + 1}</td>
              <td>{item.studentName}</td>
              <td>{formatScore(item.score)}</td>
              <td>{new Date(item.submittedAt).toLocaleString('vi-VN')}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {totalPages > 1 && (
        <div className="pagination">
          <button onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))} disabled={currentPage === 1}>
            ← Trang trước
          </button>

          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i + 1}
              onClick={() => setCurrentPage(i + 1)}
              className={currentPage === i + 1 ? 'active' : ''}
            >
              {i + 1}
            </button>
          ))}

          <button onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))} disabled={currentPage === totalPages}>
            Trang sau →
          </button>
        </div>
      )}
    </div>
  );
}

export default ScoreList;
