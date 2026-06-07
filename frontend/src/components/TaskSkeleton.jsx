import React from 'react';

const TaskSkeleton = () => {
  return (
    <div className="flex flex-col p-5 rounded-xl border border-gray-100 bg-white shadow-sm animate-pulse">
      <div className="flex items-start space-x-4 mb-2">
        <div className="w-6 h-6 rounded-full bg-gray-200 shrink-0 mt-0.5"></div>
        <div className="flex-1 w-full">
          <div className="h-5 bg-gray-200 rounded-md w-3/4 mb-3"></div>
          <div className="h-3.5 bg-gray-100 rounded-md w-full mb-2"></div>
          <div className="h-3.5 bg-gray-100 rounded-md w-5/6 mb-4"></div>
        </div>
      </div>
      <div className="mt-auto ml-10 flex justify-between items-center pt-2">
        <div className="h-6 bg-gray-200 rounded-full w-20"></div>
        <div className="h-3 bg-gray-100 rounded w-24"></div>
      </div>
    </div>
  );
};

export default TaskSkeleton;
