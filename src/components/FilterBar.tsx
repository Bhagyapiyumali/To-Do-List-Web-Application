import React from 'react';
import { FilterType, SortType } from '../types';
import { Search, Filter, ArrowUpDown } from 'lucide-react';

interface FilterBarProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  filterType: FilterType;
  onFilterChange: (filter: FilterType) => void;
  sortType: SortType;
  onSortChange: (sort: SortType) => void;
  darkMode?: boolean;
}

export function FilterBar({
  searchTerm,
  onSearchChange,
  filterType,
  onFilterChange,
  sortType,
  onSortChange,
  darkMode = false,
}: FilterBarProps) {
  const filterOptions = [
    { value: 'all', label: 'All Tasks' },
    { value: 'active', label: 'Active' },
    { value: 'completed', label: 'Completed' },
    { value: 'overdue', label: 'Overdue' },
  ];

  const sortOptions = [
    { value: 'dueDate', label: 'Due Date' },
    { value: 'priority', label: 'Priority' },
    { value: 'created', label: 'Created' },
    { value: 'alphabetical', label: 'A-Z' },
  ];

  const baseClasses = darkMode
    ? 'bg-gray-800 border-gray-700 text-white'
    : 'bg-white border-gray-200 text-gray-900';

  const inputClasses = darkMode
    ? 'border-gray-600 bg-gray-700 text-white placeholder-gray-400 focus:ring-blue-400 focus:border-blue-400'
    : 'border-gray-300 bg-white text-gray-900 placeholder-gray-500 focus:ring-blue-500 focus:border-blue-500';

  return (
    <div className={`rounded-xl shadow-sm border p-6 transition-colors duration-200 ${baseClasses}`}>
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search size={20} className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${
            darkMode ? 'text-gray-400' : 'text-gray-400'
          }`} />
          <input
            type="text"
            placeholder="Search tasks..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className={`w-full pl-10 pr-4 py-3 rounded-lg focus:outline-none focus:ring-2 transition-colors ${inputClasses}`}
          />
        </div>

        <div className="flex space-x-4">
          <div className="relative">
            <Filter size={16} className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${
              darkMode ? 'text-gray-400' : 'text-gray-400'
            }`} />
            <select
              value={filterType}
              onChange={(e) => onFilterChange(e.target.value as FilterType)}
              className={`pl-10 pr-8 py-3 rounded-lg focus:outline-none focus:ring-2 appearance-none transition-colors ${inputClasses}`}
            >
              {filterOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div className="relative">
            <ArrowUpDown size={16} className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${
              darkMode ? 'text-gray-400' : 'text-gray-400'
            }`} />
            <select
              value={sortType}
              onChange={(e) => onSortChange(e.target.value as SortType)}
              className={`pl-10 pr-8 py-3 rounded-lg focus:outline-none focus:ring-2 appearance-none transition-colors ${inputClasses}`}
            >
              {sortOptions.map(option => (
                <option key={option.value} value={option.value}>
                  Sort by {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}