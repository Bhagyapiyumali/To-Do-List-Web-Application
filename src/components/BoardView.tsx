import React from 'react';
import { Task } from '../types';
import { TaskCard } from './TaskCard';

interface BoardViewProps {
  tasks: Task[];
  onToggle: (id: string) => void;
  onUpdate: (id: string, updates: Partial<Task>) => void;
  onDelete: (id: string) => void;
}

export function BoardView({ tasks, onToggle, onUpdate, onDelete }: BoardViewProps) {
  const columns = [
    { id: 'todo', title: 'To Do', tasks: tasks.filter(t => !t.completed) },
    { id: 'completed', title: 'Completed', tasks: tasks.filter(t => t.completed) },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {columns.map(column => (
        <div key={column.id} className="bg-gray-50 rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">{column.title}</h2>
            <span className="bg-gray-200 text-gray-600 px-3 py-1 rounded-full text-sm font-medium">
              {column.tasks.length}
            </span>
          </div>
          
          <div className="space-y-4">
            {column.tasks.length === 0 ? (
              <div className="text-center py-8">
                <div className="text-gray-400 text-sm">No tasks in this column</div>
              </div>
            ) : (
              column.tasks.map(task => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onToggle={onToggle}
                  onUpdate={onUpdate}
                  onDelete={onDelete}
                />
              ))
            )}
          </div>
        </div>
      ))}
    </div>
  );
}