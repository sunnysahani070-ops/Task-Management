import React from 'react';
import { FaSearch } from 'react-icons/fa';
import Input from './ui/Input';

const FilterBar = ({
  searchInput,
  setSearchInput,
  filterStatus,
  setFilterStatus,
  filterCategory,
  setFilterCategory,
  filterPriority,
  setFilterPriority,
  sortOption,
  setSortOption,
}) => {
  return (
    <div className="flex flex-col md:flex-row flex-wrap w-full gap-3">
      {/* Search Input */}
      <div className="w-full md:flex-1">
        <Input
          type="text"
          placeholder="Search tasks..."
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          icon={FaSearch}
        />
      </div>

      {/* Status Filter */}
      <div className="w-full md:w-36">
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="block w-full px-3 py-2 text-sm border border-gray-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-indigo-500 transition-colors cursor-pointer text-gray-700 dark:text-slate-200"
        >
          <option value="all">All Status</option>
          <option value="pending">Pending</option>
          <option value="completed">Completed</option>
        </select>
      </div>

      {/* Priority Filter */}
      <div className="w-full md:w-36">
        <select
          value={filterPriority}
          onChange={(e) => setFilterPriority(e.target.value)}
          className="block w-full px-3 py-2 text-sm border border-gray-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-indigo-500 transition-colors cursor-pointer text-gray-700 dark:text-slate-200"
        >
          <option value="all">All Priorities</option>
          <option value="High">High</option>
          <option value="Medium">Medium</option>
          <option value="Low">Low</option>
        </select>
      </div>

      {/* Category Filter */}
      <div className="w-full md:w-40">
        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          className="block w-full px-3 py-2 text-sm border border-gray-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-indigo-500 transition-colors cursor-pointer text-gray-700 dark:text-slate-200"
        >
          <option value="all">All Categories</option>
          <option value="Work">Work</option>
          <option value="Personal">Personal</option>
          <option value="Study">Study</option>
          <option value="Health">Health</option>
        </select>
      </div>

      {/* Sort Option */}
      <div className="w-full md:w-40">
        <select
          value={sortOption}
          onChange={(e) => setSortOption(e.target.value)}
          className="block w-full px-3 py-2 text-sm border border-gray-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-indigo-500 transition-colors cursor-pointer text-gray-700 dark:text-slate-200"
        >
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
          <option value="dueDate">Due Date</option>
          <option value="priority">Priority</option>
        </select>
      </div>
    </div>
  );
};

export default FilterBar;
