// src/components/SoldCourseChart.tsx
import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Bar,
  LabelList,
} from 'recharts';
import { AggregatedCourse } from '../features/soldCourse/soldCourseSlice';

interface Props {
  data: AggregatedCourse[];
}

const SoldCourseChart: React.FC<Props> = ({ data }) => {
  const chartData = data.map((d) => ({
    ...d,
    shortName: d.name.length > 25 ? d.name.slice(0, 25) + '…' : d.name,
  }));

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h3 className="text-2xl font-semibold text-blue-600 text-center mb-5">
        Số lượng đã bán (theo khóa học)
      </h3>
      <div className="w-full h-[450px]">
        <ResponsiveContainer>
          <BarChart
            data={chartData}
            margin={{ top: 30, right: 30, left: 10, bottom: 90 }}
            barCategoryGap="20%"
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="shortName"
              interval={0}
              angle={-40}
              textAnchor="end"
              height={80}
              tick={{ fontSize: 14 }}
            />
            <YAxis allowDecimals={false} tick={{ fontSize: 14 }} />
            <Tooltip
              formatter={(value: any) => value}
              contentStyle={{ fontSize: '14px' }}
            />
            <Bar dataKey="count" fill="#3B82F6" name="Số lượng" barSize={45}>
              <LabelList dataKey="count" position="top" fontSize={14} />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default SoldCourseChart;
