import React from 'react';
import { BarChart3, TrendingUp, Clock, Target, Calendar, Award } from 'lucide-react';

interface AnalyticsViewProps {
  analytics: {
    completedToday: number;
    completedThisWeek: number;
    completedThisMonth: number;
    totalPomodoroSessions: number;
    categoryStats: Record<string, number>;
  };
}

export function AnalyticsView({ analytics }: AnalyticsViewProps) {
  const {
    completedToday,
    completedThisWeek,
    completedThisMonth,
    totalPomodoroSessions,
    categoryStats,
  } = analytics;

  const topCategories = Object.entries(categoryStats)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5);

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center space-x-2">
          <BarChart3 size={24} className="text-blue-500" />
          <span>Productivity Analytics</span>
        </h2>

        {/* Main Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600">Today</p>
                <p className="text-2xl font-bold text-blue-900">{completedToday}</p>
                <p className="text-xs text-blue-600">tasks completed</p>
              </div>
              <Calendar size={24} className="text-blue-500" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4 border border-green-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600">This Week</p>
                <p className="text-2xl font-bold text-green-900">{completedThisWeek}</p>
                <p className="text-xs text-green-600">tasks completed</p>
              </div>
              <TrendingUp size={24} className="text-green-500" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4 border border-purple-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-600">This Month</p>
                <p className="text-2xl font-bold text-purple-900">{completedThisMonth}</p>
                <p className="text-xs text-purple-600">tasks completed</p>
              </div>
              <Target size={24} className="text-purple-500" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-lg p-4 border border-red-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-red-600">Focus Sessions</p>
                <p className="text-2xl font-bold text-red-900">{totalPomodoroSessions}</p>
                <p className="text-xs text-red-600">pomodoro sessions</p>
              </div>
              <Clock size={24} className="text-red-500" />
            </div>
          </div>
        </div>

        {/* Category Breakdown */}
        <div className="bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
            <Award size={20} className="text-yellow-500" />
            <span>Top Categories</span>
          </h3>
          
          {topCategories.length > 0 ? (
            <div className="space-y-3">
              {topCategories.map(([category, count], index) => {
                const percentage = Math.round((count / Object.values(categoryStats).reduce((a, b) => a + b, 0)) * 100);
                const colors = [
                  'bg-blue-500',
                  'bg-green-500',
                  'bg-purple-500',
                  'bg-yellow-500',
                  'bg-red-500',
                ];
                
                return (
                  <div key={category} className="flex items-center space-x-3">
                    <div className="flex-1">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm font-medium text-gray-700">{category}</span>
                        <span className="text-sm text-gray-500">{count} tasks ({percentage}%)</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${colors[index % colors.length]}`}
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="text-gray-400 text-sm">No category data available yet</div>
              <p className="text-gray-500 text-xs mt-1">Start adding categories to your tasks to see insights</p>
            </div>
          )}
        </div>

        {/* Productivity Tips */}
        <div className="mt-6 bg-blue-50 rounded-lg p-4 border border-blue-200">
          <h4 className="font-semibold text-blue-900 mb-2">💡 Productivity Insights</h4>
          <div className="text-sm text-blue-700 space-y-1">
            {completedToday === 0 && (
              <p>• Start your day by completing at least one task to build momentum!</p>
            )}
            {totalPomodoroSessions < 5 && (
              <p>• Try using the Pomodoro timer to improve focus and track your work sessions.</p>
            )}
            {completedThisWeek > completedToday * 7 && (
              <p>• Great job! You're ahead of your daily average this week. 🎉</p>
            )}
            {Object.keys(categoryStats).length < 3 && (
              <p>• Consider organizing your tasks with categories for better insights.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}