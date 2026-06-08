import React from 'react';
import { Card, CardContent } from './ui/Card';

const ChartSkeleton = () => {
  return (
    <Card className="h-full min-h-[300px] animate-pulse border border-gray-100 dark:border-slate-800 bg-white dark:bg-slate-800">
      <CardContent className="p-6 flex flex-col h-full">
        <div className="flex items-center gap-2 mb-6">
          <div className="w-5 h-5 rounded-full bg-indigo-200 dark:bg-slate-700"></div>
          <div className="h-6 bg-gray-200 dark:bg-slate-700 rounded w-1/3"></div>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <div className="w-48 h-48 rounded-full border-8 border-gray-100 dark:border-slate-700 border-t-gray-200 dark:border-t-slate-600"></div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ChartSkeleton;
