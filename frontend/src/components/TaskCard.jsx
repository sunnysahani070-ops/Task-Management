import React from 'react';
import { FaTrash, FaCheckCircle, FaRegCircle, FaEdit } from 'react-icons/fa';

const TaskCard = ({ task, onToggleStatus, onDeleteTask, onEditTask }) => {
  const isCompleted = task.status === 'completed';
  
  // Format the created date
  const createdDate = new Date(task.createdAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  return (
    <div className={`group relative flex flex-col p-6 rounded-2xl border transition-all duration-300 transform hover:-translate-y-1 hover:shadow-xl ${
      isCompleted 
        ? 'bg-gray-50/80 border-gray-200 opacity-80 hover:opacity-100' 
        : 'bg-white border-gray-100 hover:border-indigo-200 shadow-sm'
    }`}>
      <div className="flex justify-between items-start mb-2">
        <div className="flex items-start space-x-3 overflow-hidden flex-1">
          <button
            onClick={() => onToggleStatus(task._id)}
            className={`mt-0.5 flex-shrink-0 focus:outline-none transition-transform hover:scale-110 ${
              isCompleted ? 'text-green-500' : 'text-gray-300 hover:text-indigo-500'
            }`}
            title={isCompleted ? 'Mark as pending' : 'Mark as completed'}
          >
            {isCompleted ? <FaCheckCircle size={22} /> : <FaRegCircle size={22} />}
          </button>
          <div className="flex-1 min-w-0 pt-0.5">
            <h3 className={`text-lg font-bold truncate transition-all duration-300 ${
              isCompleted ? 'text-gray-400 line-through' : 'text-gray-900 group-hover:text-indigo-700'
            }`}>
              {task.title}
            </h3>
          </div>
        </div>
        
        {/* Actions Menu (Visible on Hover) */}
        <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity ml-2 flex-shrink-0">
          <button
            onClick={() => onEditTask(task)}
            className="text-gray-400 hover:text-blue-500 hover:bg-blue-50 focus:outline-none p-2 rounded-md transition-colors"
            title="Edit task"
          >
            <FaEdit size={16} />
          </button>
          <button
            onClick={() => onDeleteTask(task._id)}
            className="text-gray-400 hover:text-red-500 hover:bg-red-50 focus:outline-none p-2 rounded-md transition-colors"
            title="Delete task"
          >
            <FaTrash size={16} />
          </button>
        </div>
      </div>

      {/* Description */}
      {task.description && (
        <p className={`text-sm ml-8 mb-4 break-words line-clamp-3 ${
          isCompleted ? 'text-gray-400' : 'text-gray-600'
        }`}>
          {task.description}
        </p>
      )}

      {/* Footer: Status Badge & Date */}
      <div className="mt-auto ml-8 flex justify-between items-center pt-2">
        <span className={`px-2.5 py-1 text-xs rounded-full font-medium ${
          isCompleted 
            ? 'bg-green-100 text-green-700 border border-green-200' 
            : 'bg-yellow-50 text-yellow-700 border border-yellow-200'
        }`}>
          {isCompleted ? 'Completed' : 'Pending'}
        </span>
        <span className="text-gray-400 text-xs font-medium flex items-center">
          {createdDate}
        </span>
      </div>
    </div>
  );
};

export default TaskCard;
