import React from 'react';
import { CheckSquare, Plus, LayoutGrid, List, Calendar, BarChart3, Moon, Sun, Settings } from 'lucide-react';
import { ViewMode } from '../types';

interface HeaderProps {
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  onCreateTask: () => void;
  darkMode: boolean;
  onToggleDarkMode: () => void;
}

export function Header({ viewMode, onViewModeChange, onCreateTask, darkMode, onToggleDarkMode }: HeaderProps) {
  const viewModes = [
    { mode: 'list' as const, icon: List, label: 'List' },
    { mode: 'board' as const, icon: LayoutGrid, label: 'Board' },
    { mode: 'calendar' as const, icon: Calendar, label: 'Calendar' },
    { mode: 'analytics' as const, icon: BarChart3, label: 'Analytics' },
  ];

  return (
    <header className={`shadow-sm border-b ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              <CheckSquare size={32} className="text-blue-500" />
              <h1 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>TaskFlow</h1>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className={`flex rounded-lg p-1 ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
              {viewModes.map(({ mode, icon: Icon, label }) => (
                <button
                  key={mode}
                  onClick={() => onViewModeChange(mode)}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-md transition-colors ${
                    viewMode === mode
                      ? darkMode 
                        ? 'bg-gray-600 text-blue-400 shadow-sm'
                        : 'bg-white text-blue-600 shadow-sm'
                      : darkMode
                        ? 'text-gray-300 hover:text-blue-400'
                        : 'text-gray-600 hover:text-blue-600'
                  }`}
                >
                  <Icon size={16} />
                  <span className="hidden sm:inline">{label}</span>
                </button>
              ))}
            </div>

            <button
              onClick={onToggleDarkMode}
              className={`p-2 rounded-lg transition-colors ${
                darkMode 
                  ? 'text-gray-300 hover:text-yellow-400 hover:bg-gray-700'
                  : 'text-gray-600 hover:text-blue-600 hover:bg-gray-100'
              }`}
              title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {darkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            <button
              onClick={onCreateTask}
              className="flex items-center space-x-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
            >
              <Plus size={16} />
              <span className="hidden sm:inline">New Task</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}