import React, { useState, useEffect } from 'react';
import taskService from '../services/taskService';
import { useToast } from '../context/ToastContext';

const EditTaskModal = ({ isOpen, onClose, task, onTaskUpdated }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();

  // Populate form when modal opens with a task
  useEffect(() => {
    if (task && isOpen) {
      setTitle(task.title || '');
      setDescription(task.description || '');
    }
  }, [task, isOpen]);

  if (!isOpen) return null;

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) {
      showToast('Title is required', 'error');
      return;
    }

    try {
      setLoading(true);
      
      const updatedTask = await taskService.updateTask(task._id, { title, description });
      
      // Notify parent to update the list
      if (onTaskUpdated) {
        onTaskUpdated(updatedTask);
      }
      
      showToast('Task updated successfully', 'success');
      
      // Close modal
      onClose();
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to update task', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm px-4 transition-all">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-fade-in-up border border-gray-100">
        <div className="flex justify-between items-center p-6 border-b border-gray-100/80 bg-gray-50/50">
          <h2 className="text-xl font-extrabold text-gray-900 bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">Edit Task</h2>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-red-500 hover:bg-red-50 focus:outline-none transition-all p-1.5 rounded-lg"
            title="Close"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-6">
          <form onSubmit={onSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5" htmlFor="edit-title">Task Title <span className="text-red-500">*</span></label>
              <input
                type="text"
                id="edit-title"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-2.5 bg-gray-50/50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 focus:bg-white text-sm transition-all duration-300 placeholder:text-gray-400"
                disabled={loading}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5" htmlFor="edit-description">Description (Optional)</label>
              <textarea
                id="edit-description"
                rows="4"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-4 py-2.5 bg-gray-50/50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 focus:bg-white text-sm resize-none transition-all duration-300 placeholder:text-gray-400"
                disabled={loading}
              ></textarea>
            </div>
            
            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                disabled={loading}
                className="px-5 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-50 hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-200 transition-all active:scale-[0.98]"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!title.trim() || loading}
                className="px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 disabled:from-indigo-400 disabled:to-indigo-400 disabled:cursor-not-allowed border border-transparent rounded-xl text-sm font-semibold text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 shadow-md hover:shadow-lg transition-all active:scale-[0.98]"
              >
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditTaskModal;
