import React from 'react';
import {
  ResponsiveContainer,
  ComposedChart,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Bar,
  Line,
  CartesianGrid,
} from 'recharts';

interface ScoreChartProps {
  data: { name: string; score: number }[];
}

const ScoreChart: React.FC<ScoreChartProps> = ({ data }) => {
  const scores = data.map((item) => item.score);
  const average = Number((scores.reduce((sum, s) => sum + s, 0) / scores.length).toFixed(2));
  const sortedScores = [...scores].sort((a, b) => a - b);
  const median =
    scores.length % 2 === 0
      ? Number(((sortedScores[scores.length / 2 - 1] + sortedScores[scores.length / 2]) / 2).toFixed(2))
      : sortedScores[Math.floor(scores.length / 2)];

  const stdDev = Number(
    Math.sqrt(scores.reduce((sum, s) => sum + Math.pow(s - average, 2), 0) / scores.length).toFixed(2)
  );

  const min = Math.min(...scores);
  const max = Math.max(...scores);

  const chartData = data.map((item) => ({
    ...item,
    avg: average,
  }));

  return (
    <div style={{ width: '100%', marginTop: 50 }}>
      <h3 style={{ textAlign: 'center', color: '#0d47a1' }}>
        Biểu đồ điểm lớp & điểm trung bình
      </h3>

      <div style={{ width: '100%', height: 400 }}>
        <ResponsiveContainer>
          <ComposedChart data={chartData}>
            <CartesianGrid stroke="#f5f5f5" />
            <XAxis
              dataKey="name"
              interval={0}
              angle={-30}
              textAnchor="end"
              height={80}
              tick={{ fontSize: 12 }}
            />
            <YAxis domain={[0, 10]} />
            <Tooltip />
            <Legend
              verticalAlign="top"
              align="right"
              wrapperStyle={{ top: 0 }}
            />
            <Bar dataKey="score" barSize={30} fill="#64b5f6" name="Điểm học sinh" />
            <Line type="monotone" dataKey="avg" stroke="#ef5350" strokeWidth={2} name="Điểm trung bình" />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      <div style={{
        maxWidth: 400,
        margin: '20px 0 20px 50px',
        background: '#fafafa',
        padding: 16,
        borderRadius: 10,
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        border: '1px solid #ddd',
      }}>
        <table style={{
          width: '100%',
          borderCollapse: 'collapse',
          fontSize: 14,
        }}>
          <thead>
            <tr style={{ backgroundColor: '#1976d2', color: '#fff' }}>
              <th colSpan={2} style={{
                textAlign: 'center',
                fontSize: 16,
                padding: '8px 0',
                borderTopLeftRadius: 6,
                borderTopRightRadius: 6,
              }}>
                Thống kê
              </th>
            </tr>
          </thead>
          <tbody>
            {[
              ['Số học sinh', scores.length],
              ['Mean', average],
              ['Median', median],
              ['Std. Dev', stdDev],
              ['Min', min],
              ['Max', max],
            ].map(([label, value], idx) => (
              <tr
                key={label}
                style={{
                  backgroundColor: idx % 2 === 0 ? '#fff' : '#f0f4f8',
                  borderBottom: '1px solid #ccc',
                }}
              >
                <td style={{ padding: '8px 12px', fontWeight: 500, borderRight: '1px solid #ccc' }}>{label}</td>
                <td style={{ padding: '8px 12px' }}>{value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ScoreChart;
