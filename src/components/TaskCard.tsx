import React, { useState } from 'react';
import { Task, Subtask } from '../types';
import { 
  Calendar, 
  Clock, 
  Flag, 
  User, 
  Edit3, 
  Trash2, 
  Check,
  Tag,
  Plus,
  Paperclip,
  Timer,
  Repeat
} from 'lucide-react';
import { PomodoroTimer } from './PomodoroTimer';

interface TaskCardProps {
  task: Task;
  onToggle: (id: string) => void;
  onUpdate: (id: string, updates: Partial<Task>) => void;
  onDelete: (id: string) => void;
  onAddSubtask?: (taskId: string, title: string) => void;
  onToggleSubtask?: (taskId: string, subtaskId: string) => void;
  onIncrementPomodoro?: (taskId: string) => void;
  onCelebration?: () => void;
}

export function TaskCard({ 
  task, 
  onToggle, 
  onUpdate, 
  onDelete, 
  onAddSubtask,
  onToggleSubtask,
  onIncrementPomodoro,
  onCelebration
}: TaskCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(task.title);
  const [editDescription, setEditDescription] = useState(task.description);
  const [showPomodoro, setShowPomodoro] = useState(false);
  const [newSubtask, setNewSubtask] = useState('');

  const handleToggle = () => {
    if (!task.completed && onCelebration) {
      onCelebration();
    }
    onToggle(task.id);
  };

  const handleSave = () => {
    onUpdate(task.id, { title: editTitle, description: editDescription });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditTitle(task.title);
    setEditDescription(task.description);
    setIsEditing(false);
  };

  const handleAddSubtask = () => {
    if (newSubtask.trim() && onAddSubtask) {
      onAddSubtask(task.id, newSubtask.trim());
      setNewSubtask('');
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-50';
      case 'medium': return 'text-yellow-600 bg-yellow-50';
      case 'low': return 'text-green-600 bg-green-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getProgressPercentage = () => {
    if (task.subtasks.length === 0) return task.completed ? 100 : 0;
    const completedSubtasks = task.subtasks.filter(st => st.completed).length;
    return Math.round((completedSubtasks / task.subtasks.length) * 100);
  };

  const isOverdue = new Date(task.dueDate) < new Date() && !task.completed;
  const isDueSoon = new Date(task.dueDate) <= new Date(Date.now() + 24 * 60 * 60 * 1000) && !task.completed;

  return (
    <div className={`bg-white rounded-xl shadow-sm border border-gray-200 p-6 transition-all duration-200 hover:shadow-md ${
      task.completed ? 'opacity-60' : ''
    } ${isOverdue ? 'border-red-200 bg-red-50' : ''}`}>
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-3 flex-1">
          <button
            onClick={handleToggle}
            className={`mt-1 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
              task.completed
                ? 'bg-green-500 border-green-500 text-white'
                : 'border-gray-300 hover:border-green-500'
            }`}
          >
            {task.completed && <Check size={12} />}
          </button>
          
          <div className="flex-1 min-w-0">
            {isEditing ? (
              <div className="space-y-3">
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="w-full text-lg font-semibold border-b-2 border-blue-500 bg-transparent focus:outline-none"
                  autoFocus
                />
                <textarea
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  className="w-full text-gray-600 bg-gray-50 rounded-lg p-3 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  rows={3}
                />
                <div className="flex space-x-2">
                  <button
                    onClick={handleSave}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                  >
                    Save
                  </button>
                  <button
                    onClick={handleCancel}
                    className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="flex items-center space-x-2 mb-1">
                  <h3 className={`text-lg font-semibold text-gray-900 ${
                    task.completed ? 'line-through' : ''
                  }`}>
                    {task.title}
                  </h3>
                  {task.isRecurring && (
                    <Repeat size={16} className="text-blue-500" title="Recurring task" />
                  )}
                </div>
                {task.description && (
                  <p className={`text-gray-600 mt-1 ${
                    task.completed ? 'line-through' : ''
                  }`}>
                    {task.description}
                  </p>
                )}

                {/* Progress bar for subtasks */}
                {task.subtasks.length > 0 && (
                  <div className="mt-3">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm text-gray-500">Progress</span>
                      <span className="text-sm text-gray-500">{getProgressPercentage()}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${getProgressPercentage()}%` }}
                      />
                    </div>
                  </div>
                )}

                {/* Subtasks */}
                {task.subtasks.length > 0 && (
                  <div className="mt-4 space-y-2">
                    {task.subtasks.map((subtask) => (
                      <div key={subtask.id} className="flex items-center space-x-2">
                        <button
                          onClick={() => onToggleSubtask?.(task.id, subtask.id)}
                          className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-colors ${
                            subtask.completed
                              ? 'bg-green-500 border-green-500 text-white'
                              : 'border-gray-300 hover:border-green-500'
                          }`}
                        >
                          {subtask.completed && <Check size={10} />}
                        </button>
                        <span className={`text-sm ${subtask.completed ? 'line-through text-gray-500' : 'text-gray-700'}`}>
                          {subtask.title}
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Add subtask input */}
                {onAddSubtask && (
                  <div className="mt-3 flex space-x-2">
                    <input
                      type="text"
                      value={newSubtask}
                      onChange={(e) => setNewSubtask(e.target.value)}
                      placeholder="Add subtask..."
                      className="flex-1 text-sm px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      onKeyPress={(e) => e.key === 'Enter' && handleAddSubtask()}
                    />
                    <button
                      onClick={handleAddSubtask}
                      className="px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {!isEditing && (
          <div className="flex items-center space-x-2 ml-4">
            <button
              onClick={() => setShowPomodoro(!showPomodoro)}
              className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
              title="Pomodoro Timer"
            >
              <Timer size={16} />
            </button>
            <button
              onClick={() => setIsEditing(true)}
              className="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
            >
              <Edit3 size={16} />
            </button>
            <button
              onClick={() => onDelete(task.id)}
              className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
            >
              <Trash2 size={16} />
            </button>
          </div>
        )}
      </div>

      {/* Pomodoro Timer */}
      {showPomodoro && onIncrementPomodoro && (
        <div className="mt-4">
          <PomodoroTimer
            taskId={task.id}
            onSessionComplete={onIncrementPomodoro}
          />
        </div>
      )}

      {!isEditing && (
        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1 text-sm text-gray-500">
              <Calendar size={14} />
              <span className={`${isOverdue ? 'text-red-600 font-medium' : isDueSoon ? 'text-yellow-600 font-medium' : ''}`}>
                {new Date(task.dueDate).toLocaleDateString()}
              </span>
            </div>
            
            <div className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(task.priority)}`}>
              <Flag size={12} className="inline mr-1" />
              {task.priority}
            </div>

            {task.category && (
              <div className="flex items-center space-x-1 text-sm text-gray-500">
                <Tag size={12} />
                <span>{task.category}</span>
              </div>
            )}

            {task.pomodoroSessions && task.pomodoroSessions > 0 && (
              <div className="flex items-center space-x-1 text-sm text-red-500">
                <Timer size={12} />
                <span>{task.pomodoroSessions}</span>
              </div>
            )}
          </div>

          {task.assignedTo && (
            <div className="flex items-center space-x-1 text-sm text-gray-500">
              <User size={14} />
              <span>{task.assignedTo}</span>
            </div>
          )}
        </div>
      )}

      {task.tags.length > 0 && !isEditing && (
        <div className="mt-3 flex flex-wrap gap-2">
          {task.tags.map((tag, index) => (
            <span
              key={index}
              className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}

      {task.attachments.length > 0 && !isEditing && (
        <div className="mt-3 flex items-center space-x-2">
          <Paperclip size={14} className="text-gray-400" />
          <span className="text-sm text-gray-500">{task.attachments.length} attachment(s)</span>
        </div>
      )}
    </div>
  );
}