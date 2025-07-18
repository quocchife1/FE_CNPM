import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './ScoreList.css';
import ReactDOM from 'react-dom/client';

function ScoreList() {
  const { examId } = useParams();
  const [examName, setExamName] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    //const examSession = document.getElementById('examSession.id')?.value;
    axios.get(`http://localhost:8080/api/v1/listresult/${examId}`)
      .then(res => {
        const data = res.data.data;
        setExamName(data.examName);
        setResults(data.results);
        setLoading(false);
      })
      .catch(err => {
        console.error('Lỗi khi gọi API:', err);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Đang tải dữ liệu...</p>;

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
          {results.map((item, index) => (
            <tr key={item.studentId}>
              <td>{index + 1}</td>
              <td>{item.studentName}</td>
              <td>{item.score}</td>
              <td>{new Date(item.submittedAt).toLocaleString('vi-VN')}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ScoreList;

window.loadScoreList = function () {
  console.log("✅ Hàm loadScoreList được gọi");
  const rootElement = document.getElementById('score-root');
  const root = ReactDOM.createRoot(rootElement);
  root.render(<ScoreList />);
};

