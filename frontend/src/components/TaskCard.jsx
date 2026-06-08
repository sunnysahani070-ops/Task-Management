import React from 'react';
import { FaTrash, FaCheckCircle, FaRegCircle, FaEdit, FaCalendarAlt } from 'react-icons/fa';
import { isToday, isTomorrow, differenceInCalendarDays, startOfDay } from 'date-fns';
import { Card } from './ui/Card';
import Badge from './ui/Badge';
import Button from './ui/Button';

const TaskCard = ({ task, onToggleStatus, onDeleteTask, onEditTask }) => {
  const isCompleted = task.status === 'completed';
  
  // Format the created date
  const createdDate = new Date(task.createdAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  // Calculate Due Date Status
  let dueDateText = null;
  let dueDateColor = 'text-gray-500 dark:text-slate-400';

  if (task.dueDate) {
    const date = new Date(task.dueDate);
    const today = startOfDay(new Date());
    const dueDay = startOfDay(date);

    if (isCompleted) {
      dueDateText = 'Completed';
      dueDateColor = 'text-emerald-500 dark:text-emerald-400';
    } else if (isToday(date)) {
      dueDateText = 'Due Today';
      dueDateColor = 'text-amber-600 dark:text-amber-400 font-semibold';
    } else if (isTomorrow(date)) {
      dueDateText = 'Due Tomorrow';
      dueDateColor = 'text-indigo-600 dark:text-indigo-400 font-medium';
    } else if (dueDay < today) {
      dueDateText = 'Overdue';
      dueDateColor = 'text-red-600 dark:text-red-400 font-bold';
    } else {
      const days = differenceInCalendarDays(dueDay, today);
      dueDateText = `Due in ${days} Days`;
      dueDateColor = 'text-gray-500 dark:text-slate-400';
    }
  }

  return (
    <Card className={`group relative flex flex-col p-5 transition-all duration-300 hover:shadow-md ${
      isCompleted ? 'bg-gray-50 dark:bg-slate-800/80 opacity-80' : 'bg-white dark:bg-slate-800'
    }`}>
      <div className="flex justify-between items-start mb-2">
        <div className="flex items-start space-x-3 overflow-hidden flex-1">
          <button
            onClick={() => onToggleStatus(task._id)}
            className={`mt-0.5 flex-shrink-0 focus:outline-none transition-transform hover:scale-110 ${
              isCompleted ? 'text-emerald-500' : 'text-gray-300 dark:text-slate-500 hover:text-indigo-500 dark:hover:text-indigo-400'
            }`}
            title={isCompleted ? 'Mark as pending' : 'Mark as completed'}
          >
            {isCompleted ? <FaCheckCircle size={22} /> : <FaRegCircle size={22} />}
          </button>
          <div className="flex-1 min-w-0 pt-0.5">
            <h3 className={`text-base sm:text-lg font-semibold truncate transition-colors duration-200 ${
              isCompleted ? 'text-gray-400 dark:text-slate-500 line-through' : 'text-gray-900 dark:text-slate-100 group-hover:text-indigo-700 dark:group-hover:text-indigo-400'
            }`}>
              {task.title}
            </h3>
          </div>
        </div>
        
        {/* Actions Menu */}
        <div className="flex space-x-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity ml-2 flex-shrink-0">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onEditTask(task)}
            title="Edit task"
            className="text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/30"
          >
            <FaEdit size={16} />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onDeleteTask(task._id)}
            title="Delete task"
            className="text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30"
          >
            <FaTrash size={16} />
          </Button>
        </div>
      </div>

      {/* Description */}
      {task.description && (
        <p className={`text-sm ml-8 mb-4 break-words line-clamp-3 ${
          isCompleted ? 'text-gray-400 dark:text-slate-500' : 'text-gray-600 dark:text-slate-400'
        }`}>
          {task.description}
        </p>
      )}

      {/* Footer: Status Badge, Priority Badge & Date */}
      <div className="mt-auto ml-8 flex justify-between items-center pt-2 border-t border-gray-50 dark:border-slate-700">
        <div className="flex flex-wrap gap-2">
          <Badge variant={isCompleted ? 'success' : 'warning'}>
            {isCompleted ? 'Completed' : 'Pending'}
          </Badge>
          <Badge 
            variant={
              task.category === 'Work' ? 'blue' :
              task.category === 'Study' ? 'orange' :
              task.category === 'Health' ? 'teal' :
              'purple' // Personal
            }
          >
            {task.category || 'Personal'}
          </Badge>
          <Badge 
            variant={
              task.priority === 'High' ? 'danger' :
              task.priority === 'Medium' ? 'warning' :
              'success'
            }
          >
            {task.priority || 'Medium'} Priority
          </Badge>
        </div>
        <div className="flex flex-col items-end">
          {dueDateText && (
            <div className={`flex items-center space-x-1 text-xs mb-1 ${dueDateColor}`}>
              <FaCalendarAlt size={10} />
              <span>{dueDateText}</span>
            </div>
          )}
          <span className="text-gray-400 text-xs font-medium">
            {createdDate}
          </span>
        </div>
      </div>
    </Card>
  );
};

export default TaskCard;
