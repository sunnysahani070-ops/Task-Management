import React, { useState } from 'react';
import taskService from '../services/taskService';
import { useToast } from '../context/ToastContext';

const AddTask = ({ onTaskAdded }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) {
      showToast('Title is required', 'error');
      return;
    }

    try {
      setLoading(true);
      
      // API Integration
      const newTask = await taskService.createTask({ title, description });
      
      // Reset form
      setTitle('');
      setDescription('');
      
      showToast('Task created successfully!', 'success');
      
      // Refresh task list in parent
      if (onTaskAdded) {
        onTaskAdded(newTask);
      }
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to create task', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white/80 backdrop-blur-xl shadow-xl rounded-2xl p-6 border border-gray-100/50 sticky top-8 transition-all hover:shadow-2xl">
      <h2 className="text-xl font-extrabold text-gray-900 mb-6 pb-3 border-b border-gray-100/80 bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">Add New Task</h2>

      <form onSubmit={onSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5" htmlFor="title">Task Title <span className="text-red-500">*</span></label>
          <input
            type="text"
            id="title"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-4 py-2.5 bg-gray-50/50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 focus:bg-white text-sm transition-all duration-300 placeholder:text-gray-400"
            placeholder="E.g., Complete project report"
            disabled={loading}
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5" htmlFor="description">Description (Optional)</label>
          <textarea
            id="description"
            rows="3"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-4 py-2.5 bg-gray-50/50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 focus:bg-white text-sm resize-none transition-all duration-300 placeholder:text-gray-400"
            placeholder="Add more details here..."
            disabled={loading}
          ></textarea>
        </div>
        <button
          type="submit"
          disabled={!title.trim() || loading}
          className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 disabled:from-indigo-400 disabled:to-indigo-400 disabled:cursor-not-allowed text-white font-semibold py-3 px-4 rounded-xl transition-all duration-300 transform active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 shadow-md hover:shadow-lg"
        >
          {loading ? 'Adding Task...' : 'Create Task'}
        </button>
      </form>
    </div>
  );
};

export default AddTask;
