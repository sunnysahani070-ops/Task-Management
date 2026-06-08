import React from 'react';
import { Card, CardContent } from './ui/Card';
import { FaPlus, FaEdit, FaCheck, FaTrash, FaClock } from 'react-icons/fa';
import ActivitySkeleton from './ActivitySkeleton';

const ActivityTimeline = ({ activities, loading }) => {
  if (loading) {
    return <ActivitySkeleton />;
  }

  // Group activities
  const groupActivities = (acts) => {
    const groups = { Today: [], Yesterday: [], Earlier: [] };
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    acts.forEach(act => {
      const actDate = new Date(act.createdAt);
      if (actDate >= today) {
        groups.Today.push(act);
      } else if (actDate >= yesterday) {
        groups.Yesterday.push(act);
      } else {
        groups.Earlier.push(act);
      }
    });

    return groups;
  };

  const grouped = groupActivities(activities || []);
  const hasActivities = (activities || []).length > 0;

  const getActionConfig = (action) => {
    switch (action) {
      case 'Task Created':
        return { icon: FaPlus, bg: 'bg-emerald-100 dark:bg-emerald-900/30', color: 'text-emerald-600 dark:text-emerald-400' };
      case 'Task Updated':
        return { icon: FaEdit, bg: 'bg-blue-100 dark:bg-blue-900/30', color: 'text-blue-600 dark:text-blue-400' };
      case 'Task Completed':
        return { icon: FaCheck, bg: 'bg-indigo-100 dark:bg-indigo-900/30', color: 'text-indigo-600 dark:text-indigo-400' };
      case 'Task Deleted':
        return { icon: FaTrash, bg: 'bg-red-100 dark:bg-red-900/30', color: 'text-red-600 dark:text-red-400' };
      default:
        return { icon: FaClock, bg: 'bg-gray-100 dark:bg-slate-800', color: 'text-gray-600 dark:text-gray-400' };
    }
  };

  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString([], { month: 'short', day: 'numeric' });
  };

  return (
    <Card className="h-full border border-gray-100 dark:border-slate-800">
      <CardContent className="p-6">
        <div className="flex items-center gap-2 mb-6">
          <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
            <FaClock />
          </div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">Recent Activity</h3>
        </div>

        {!hasActivities ? (
          <div className="text-center py-10 opacity-60">
            <FaClock className="mx-auto text-3xl mb-3 text-gray-400" />
            <p className="text-sm text-gray-500 dark:text-gray-400">No recent activity</p>
          </div>
        ) : (
          <div className="space-y-8 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-gray-200 dark:before:via-slate-700 before:to-transparent">
            {['Today', 'Yesterday', 'Earlier'].map((groupLabel) => (
              grouped[groupLabel].length > 0 && (
                <div key={groupLabel} className="relative z-10">
                  <div className="mb-4 ml-12 font-semibold text-xs text-gray-500 uppercase tracking-wider">
                    {groupLabel}
                  </div>
                  <div className="space-y-6">
                    {grouped[groupLabel].map((act, index) => {
                      const { icon: Icon, bg, color } = getActionConfig(act.action);
                      return (
                        <div key={act._id || index} className="relative flex items-start gap-4 group">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 z-10 ring-4 ring-white dark:ring-slate-900 ${bg} ${color} transition-transform group-hover:scale-110`}>
                            <Icon size={14} />
                          </div>
                          <div className="flex-1 pt-1 min-w-0">
                            <p className="text-sm text-gray-900 dark:text-white">
                              <span className="font-semibold">{act.action}</span>
                              <span className="text-gray-500 dark:text-gray-400 mx-1">&bull;</span>
                              <span className="text-gray-600 dark:text-gray-300 truncate inline-block max-w-[200px] align-bottom">
                                {act.taskTitle}
                              </span>
                            </p>
                            <span className="text-xs text-gray-400 dark:text-gray-500 mt-0.5 block">
                              {groupLabel === 'Earlier' ? formatDate(act.createdAt) + ' at ' : ''}
                              {formatTime(act.createdAt)}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ActivityTimeline;
