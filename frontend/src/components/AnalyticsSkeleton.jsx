import React from 'react';
import { Card, CardContent } from './ui/Card';

const AnalyticsSkeleton = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {[...Array(4)].map((_, i) => (
        <Card key={i} className="animate-pulse border border-gray-100 dark:border-slate-800 bg-white dark:bg-slate-800">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-3 w-full pr-4">
                <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded w-1/2"></div>
                <div className="h-8 bg-gray-200 dark:bg-slate-700 rounded w-1/3"></div>
              </div>
              <div className="w-12 h-12 bg-gray-200 dark:bg-slate-700 rounded-full flex-shrink-0"></div>
            </div>
            {i === 2 && ( // Simulate completion rate progress bar
              <div className="mt-4">
                <div className="flex justify-between items-center mb-1">
                  <div className="h-3 bg-gray-200 dark:bg-slate-700 rounded w-24"></div>
                  <div className="h-3 bg-gray-200 dark:bg-slate-700 rounded w-8"></div>
                </div>
                <div className="w-full bg-gray-100 dark:bg-slate-700 rounded-full h-1.5 overflow-hidden">
                  <div className="bg-gray-200 dark:bg-slate-600 h-1.5 w-1/2"></div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default AnalyticsSkeleton;
