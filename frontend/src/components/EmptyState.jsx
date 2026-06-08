import React from 'react';
import { FaClipboardList, FaSearch, FaCheckCircle, FaPlus } from 'react-icons/fa';
import Button from './ui/Button';

const EmptyState = ({ type, onAction, clearFilters }) => {
  let config = {};

  switch (type) {
    case 'no-tasks':
      config = {
        icon: FaClipboardList,
        iconColor: 'text-indigo-400 dark:text-indigo-500',
        bgColor: 'bg-indigo-50 dark:bg-indigo-900/30',
        borderColor: 'border-indigo-100 dark:border-indigo-800',
        title: 'You are all caught up!',
        description: 'You currently have no tasks. Get started by creating your first task to boost your productivity.',
        actionLabel: 'Add Your First Task',
        actionIcon: FaPlus,
        onAction: () => {
          // Find the input field in AddTask and focus it
          const input = document.getElementById('title');
          if (input) input.focus();
        }
      };
      break;
    case 'no-completed':
      config = {
        icon: FaCheckCircle,
        iconColor: 'text-emerald-400 dark:text-emerald-500',
        bgColor: 'bg-emerald-50 dark:bg-emerald-900/30',
        borderColor: 'border-emerald-100 dark:border-emerald-800',
        title: 'No completed tasks yet',
        description: 'You haven\'t completed any tasks matching your other filters. Keep going, you can do it!',
        actionLabel: 'Clear Status Filter',
        actionIcon: FaSearch,
        onAction: clearFilters
      };
      break;
    case 'no-search-results':
    default:
      config = {
        icon: FaSearch,
        iconColor: 'text-amber-400 dark:text-amber-500',
        bgColor: 'bg-amber-50 dark:bg-amber-900/30',
        borderColor: 'border-amber-100 dark:border-amber-800',
        title: 'No matching tasks found',
        description: 'We couldn\'t find any tasks that match your current search or filter criteria. Try adjusting them.',
        actionLabel: 'Clear All Filters',
        actionIcon: FaSearch,
        onAction: clearFilters
      };
      break;
  }

  const Icon = config.icon;
  const ActionIcon = config.actionIcon;

  return (
    <div className="text-center py-20 flex flex-col items-center justify-center animate-fade-in">
      <div className={`${config.bgColor} p-6 rounded-full mb-6 border ${config.borderColor} shadow-sm transition-transform hover:scale-105`}>
        <Icon className={config.iconColor} size={56} />
      </div>
      <h3 className="text-gray-900 dark:text-white text-xl font-bold mb-2">
        {config.title}
      </h3>
      <p className="text-gray-500 dark:text-gray-400 text-sm max-w-md mx-auto mb-8 leading-relaxed">
        {config.description}
      </p>
      {config.actionLabel && (
        <Button 
          variant={type === 'no-tasks' ? 'primary' : 'secondary'} 
          onClick={config.onAction}
          icon={ActionIcon}
          className="shadow-sm"
        >
          {config.actionLabel}
        </Button>
      )}
    </div>
  );
};

export default EmptyState;
