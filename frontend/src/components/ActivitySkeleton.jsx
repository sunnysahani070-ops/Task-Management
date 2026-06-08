import React from 'react';
import { Card, CardContent } from './ui/Card';
import { FaClock } from 'react-icons/fa';

const ActivitySkeleton = () => {
  return (
    <Card className="h-full border border-gray-100 dark:border-slate-800 bg-white dark:bg-slate-800">
      <CardContent className="p-6">
        <div className="flex items-center gap-2 mb-6">
          <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
            <FaClock />
          </div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">Recent Activity</h3>
        </div>
        <div className="space-y-6 animate-pulse">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex gap-4">
              <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-slate-700 shrink-0"></div>
              <div className="flex-1 space-y-2 py-1">
                <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 dark:bg-slate-700 rounded w-1/4"></div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ActivitySkeleton;
