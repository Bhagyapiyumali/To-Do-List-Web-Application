import React, { useState } from 'react';
import { Header } from './components/Header';
import { FilterBar } from './components/FilterBar';
import { StatsCard } from './components/StatsCard';
import { TaskCard } from './components/TaskCard';
import { TaskForm } from './components/TaskForm';
import { BoardView } from './components/BoardView';
import { CalendarView } from './components/CalendarView';
import { AnalyticsView } from './components/AnalyticsView';
import { CelebrationAnimation } from './components/CelebrationAnimation';
import { useTasks } from './hooks/useTasks';
import { useSettings } from './hooks/useSettings';
import { useNotifications } from './hooks/useNotifications';
import { ViewMode } from './types';
import { 
  CheckCircle, 
  Clock, 
  AlertTriangle, 
  BarChart3,
  Plus
} from 'lucide-react';

function App() {
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  
  const { settings, toggleDarkMode } = useSettings();
  
  const {
    tasks,
    searchTerm,
    setSearchTerm,
    filterType,
    setFilterType,
    sortType,
    setSortType,
    createTask,
    updateTask,
    deleteTask,
    toggleTask,
    addSubtask,
    toggleSubtask,
    incrementPomodoroSession,
    getTaskStats,
    getAnalytics,
  } = useTasks();

  // Enable notifications
  useNotifications(tasks, settings.soundEnabled);

  const stats = getTaskStats();
  const analytics = getAnalytics();

  const handleCreateTask = () => {
    setShowTaskForm(true);
  };

  const handleTaskSubmit = (taskData: any) => {
    createTask(taskData);
    setShowTaskForm(false);
  };

  const handleTaskToggle = (id: string) => {
    const task = tasks.find(t => t.id === id);
    if (task && !task.completed) {
      setShowCelebration(true);
    }
    toggleTask(id);
  };

  const renderContent = () => {
    if (showTaskForm) {
      return (
        <TaskForm
          onSubmit={handleTaskSubmit}
          onCancel={() => setShowTaskForm(false)}
        />
      );
    }

    switch (viewMode) {
      case 'board':
        return (
          <BoardView
            tasks={tasks}
            onToggle={handleTaskToggle}
            onUpdate={updateTask}
            onDelete={deleteTask}
          />
        );
      case 'calendar':
        return (
          <CalendarView
            tasks={tasks}
            onToggle={handleTaskToggle}
            onUpdate={updateTask}
            onDelete={deleteTask}
          />
        );
      case 'analytics':
        return <AnalyticsView analytics={analytics} />;
      default:
        return (
          <div className="space-y-6">
            {tasks.length === 0 ? (
              <div className="text-center py-12">
                <div className="max-w-md mx-auto">
                  <div className="mb-4">
                    <CheckCircle size={48} className={`mx-auto ${settings.darkMode ? 'text-gray-600' : 'text-gray-300'}`} />
                  </div>
                  <h3 className={`text-lg font-medium mb-2 ${settings.darkMode ? 'text-white' : 'text-gray-900'}`}>
                    No tasks yet
                  </h3>
                  <p className={`mb-6 ${settings.darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    Get started by creating your first task to organize your work and boost productivity.
                  </p>
                  <button
                    onClick={handleCreateTask}
                    className="inline-flex items-center space-x-2 bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors"
                  >
                    <Plus size={20} />
                    <span>Create Your First Task</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {tasks.map(task => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    onToggle={handleTaskToggle}
                    onUpdate={updateTask}
                    onDelete={deleteTask}
                    onAddSubtask={addSubtask}
                    onToggleSubtask={toggleSubtask}
                    onIncrementPomodoro={incrementPomodoroSession}
                    onCelebration={() => setShowCelebration(true)}
                  />
                ))}
              </div>
            )}
          </div>
        );
    }
  };

  return (
    <div className={`min-h-screen transition-colors duration-200 ${
      settings.darkMode ? 'bg-gray-900' : 'bg-gray-50'
    }`}>
      <Header
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        onCreateTask={handleCreateTask}
        darkMode={settings.darkMode}
        onToggleDarkMode={toggleDarkMode}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatsCard
            title="Total Tasks"
            value={stats.total}
            icon={BarChart3}
            color="blue"
            darkMode={settings.darkMode}
          />
          <StatsCard
            title="Completed"
            value={stats.completed}
            icon={CheckCircle}
            color="green"
            darkMode={settings.darkMode}
          />
          <StatsCard
            title="Upcoming"
            value={stats.upcoming}
            icon={Clock}
            color="yellow"
            darkMode={settings.darkMode}
          />
          <StatsCard
            title="Overdue"
            value={stats.overdue}
            icon={AlertTriangle}
            color="red"
            darkMode={settings.darkMode}
          />
        </div>

        {/* Filter Bar */}
        {!showTaskForm && viewMode !== 'analytics' && (
          <div className="mb-8">
            <FilterBar
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              filterType={filterType}
              onFilterChange={setFilterType}
              sortType={sortType}
              onSortChange={setSortType}
              darkMode={settings.darkMode}
            />
          </div>
        )}

        {/* Main Content */}
        {renderContent()}
      </main>

      {/* Celebration Animation */}
      <CelebrationAnimation
        show={showCelebration}
        onComplete={() => setShowCelebration(false)}
      />
    </div>
  );
}

export default App;