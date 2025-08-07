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
  Label,
  BarChart
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

  const bins: { name: string; count: number }[] = [];
  for (let i = 0; i <= 10; i += 0.5) {
    const rangeStart = i;
    const rangeEnd = i + 0.5;
    const label = `${rangeStart.toFixed(1)} - ${rangeEnd.toFixed(1)}`;
    const count = scores.filter((score) => score >= rangeStart && score < rangeEnd).length;
    bins.push({ name: label, count });
  }

  return (
    <div className="w-full mt-12">
      <h3 className="text-center text-2xl font-bold text-blue-900 mb-4">
        Biểu đồ điểm lớp & điểm trung bình
      </h3>

      <div className="w-full h-[400px]">
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
            <YAxis domain={[0, 10]}>
              <Label value="Điểm" position="insideLeft" angle={-90} offset={10} />
            </YAxis>
            <Tooltip />
            <Legend verticalAlign="top" align="right" wrapperStyle={{ top: 0 }} />
            <Bar dataKey="score" barSize={30} fill="#64b5f6" name="Điểm học sinh" />
            <Line
              type="monotone"
              dataKey="avg"
              stroke="#ef5350"
              strokeWidth={2}
              name="Điểm trung bình"
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      <div className="flex flex-wrap justify-between items-start gap-4 mt-8">
        {/* Thống kê */}
        <div className="max-w-sm bg-gray-50 p-4 rounded-xl border border-gray-300 shadow-md flex-1">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-blue-700 text-white">
                <th colSpan={2} className="text-center text-base py-2 rounded-t-md">Thống kê</th>
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
                  className={idx % 2 === 0 ? 'bg-white' : 'bg-blue-50 border-b border-gray-300'}
                >
                  <td className="py-2 px-3 font-medium border-r border-gray-300">{label}</td>
                  <td className="py-2 px-3">{value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex-1 min-w-[400px]">
          <h3 className="text-center text-2xl font-semibold text-blue-900 mb-4">Phổ điểm</h3>
          <div className="h-[350px]">
            <ResponsiveContainer>
              <BarChart data={bins} margin={{ top: 20, right: 20, left: 0, bottom: 80 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="name"
                  interval={0}
                  angle={-45}
                  textAnchor="end"
                  height={80}
                  tick={{ fontSize: 12 }}
                >
                  <Label value="Điểm" position="bottom" offset={-5} />
                </XAxis>
                <YAxis>
                  <Label value="Số học sinh" position="insideLeft" angle={-90} offset={10} />
                </YAxis>
                <Tooltip />
                <Bar dataKey="count" fill="#1976d2" name="Số học sinh"  label={{ position: 'top' }}/>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScoreChart;
