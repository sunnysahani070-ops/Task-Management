import React from 'react';
import { Card, CardContent } from './ui/Card';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { FaChartPie } from 'react-icons/fa';
import ChartSkeleton from './ChartSkeleton';

const TaskCompletionChart = ({ data, loading }) => {
  if (loading) {
    return <ChartSkeleton />;
  }

  // Format data for Recharts
  const chartData = [
    { name: 'Completed', value: data?.completedTasks || 0, color: '#10b981' }, // Emerald-500
    { name: 'Pending', value: data?.pendingTasks || 0, color: '#f59e0b' },     // Amber-500
  ];

  const hasData = (data?.totalTasks || 0) > 0;

  return (
    <Card className="h-full border border-gray-100 dark:border-slate-800 hover:shadow-lg transition-all duration-300">
      <CardContent className="p-6 flex flex-col h-full">
        <div className="flex items-center gap-2 mb-6">
          <FaChartPie className="text-indigo-500" />
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">Completion Status</h3>
        </div>

        <div className="flex-1 min-h-[220px]">
          {hasData ? (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    borderRadius: '8px', 
                    border: 'none', 
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                    backgroundColor: 'rgba(255, 255, 255, 0.95)'
                  }}
                  itemStyle={{ fontWeight: 600 }}
                />
                <Legend 
                  verticalAlign="bottom" 
                  height={36} 
                  iconType="circle"
                  formatter={(value) => <span className="text-gray-700 dark:text-gray-300 font-medium">{value}</span>}
                />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center opacity-50">
              <div className="w-32 h-32 rounded-full border-8 border-gray-100 dark:border-slate-800 flex items-center justify-center mb-4">
                <span className="text-sm font-medium text-gray-400">0%</span>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400">No tasks available</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default TaskCompletionChart;
