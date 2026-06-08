import React, { useState, useEffect } from 'react';
import { Card, CardContent } from './ui/Card';
import { FaClipboardList, FaHourglassHalf, FaCheckCircle, FaExclamationTriangle } from 'react-icons/fa';
import AnalyticsSkeleton from './AnalyticsSkeleton';


const AnalyticsCards = ({ data, loading }) => {
  if (loading) {
    return <AnalyticsSkeleton />;
  }

  const cards = [
    {
      title: 'Total Tasks',
      value: data?.totalTasks || 0,
      icon: FaClipboardList,
      color: 'text-indigo-600 dark:text-indigo-400',
      bgColor: 'bg-indigo-50 dark:bg-indigo-900/30',
      borderColor: 'border-indigo-100 dark:border-indigo-800',
    },
    {
      title: 'Pending',
      value: data?.pendingTasks || 0,
      icon: FaHourglassHalf,
      color: 'text-amber-600 dark:text-amber-400',
      bgColor: 'bg-amber-50 dark:bg-amber-900/30',
      borderColor: 'border-amber-100 dark:border-amber-800',
    },
    {
      title: 'Completed',
      value: data?.completedTasks || 0,
      icon: FaCheckCircle,
      color: 'text-emerald-600 dark:text-emerald-400',
      bgColor: 'bg-emerald-50 dark:bg-emerald-900/30',
      borderColor: 'border-emerald-100 dark:border-emerald-800',
    },
    {
      title: 'Overdue',
      value: data?.overdueTasks || 0,
      icon: FaExclamationTriangle,
      color: 'text-red-600 dark:text-red-400',
      bgColor: 'bg-red-50 dark:bg-red-900/30',
      borderColor: 'border-red-100 dark:border-red-800',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {cards.map((card, index) => (
        <Card 
          key={index} 
          className="hover:-translate-y-1 hover:shadow-lg transition-all duration-300 border border-gray-100 dark:border-slate-800"
        >
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                  {card.title}
                </p>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {card.value}
                </h3>
              </div>
              <div className={`w-12 h-12 rounded-full flex items-center justify-center border ${card.bgColor} ${card.borderColor}`}>
                <card.icon className={`text-xl ${card.color}`} />
              </div>
            </div>
            
            {/* Show completion rate progress bar on the completed card */}
            {card.title === 'Completed' && data.totalTasks > 0 && (
              <div className="mt-4">
                <div className="flex justify-between items-center text-xs text-gray-500 dark:text-gray-400 mb-1">
                  <span>Completion Rate</span>
                  <span>{data.completionRate}%</span>
                </div>
                <div className="w-full bg-gray-100 dark:bg-slate-700 rounded-full h-1.5">
                  <div 
                    className="bg-emerald-500 h-1.5 rounded-full transition-all duration-500 ease-out" 
                    style={{ width: `${data.completionRate}%` }}
                  ></div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default AnalyticsCards;
