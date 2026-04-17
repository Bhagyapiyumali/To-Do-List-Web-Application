import { useState, useEffect } from 'react';
import { useLocalStorage } from './useLocalStorage';
import { Task, Project, FilterType, SortType, Subtask, Attachment } from '../types';

export function useTasks() {
  const taskReviver = (tasks: any[]): Task[] => {
    if (!Array.isArray(tasks)) return [];
    return tasks.map(task => ({
      ...task,
      tags: Array.isArray(task.tags) ? task.tags : [],
      subtasks: Array.isArray(task.subtasks) ? task.subtasks : [],
      attachments: Array.isArray(task.attachments) ? task.attachments : [],
      pomodoroSessions: typeof task.pomodoroSessions === 'number' ? task.pomodoroSessions : 0,
    }));
  };

  const [tasks, setTasks] = useLocalStorage<Task[]>('todo-tasks', [], taskReviver);
  const [projects, setProjects] = useLocalStorage<Project[]>('todo-projects', []);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<FilterType>('all');
  const [sortType, setSortType] = useState<SortType>('dueDate');

  const createTask = (taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newTask: Task = {
      ...taskData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      subtasks: [],
      attachments: [],
      pomodoroSessions: 0,
    };
    setTasks(prev => [...prev, newTask]);
    return newTask;
  };

  const updateTask = (id: string, updates: Partial<Task>) => {
    setTasks(prev => prev.map(task => 
      task.id === id 
        ? { ...task, ...updates, updatedAt: new Date().toISOString() }
        : task
    ));
  };

  const deleteTask = (id: string) => {
    setTasks(prev => prev.filter(task => task.id !== id));
  };

  const toggleTask = (id: string) => {
    const task = tasks.find(t => t.id === id);
    if (task) {
      updateTask(id, { completed: !task.completed });
      
      // Create recurring task if needed
      if (!task.completed && task.isRecurring && task.recurringType) {
        createRecurringTask(task);
      }
    }
  };

  const createRecurringTask = (originalTask: Task) => {
    const newDueDate = new Date(originalTask.dueDate);
    
    switch (originalTask.recurringType) {
      case 'daily':
        newDueDate.setDate(newDueDate.getDate() + 1);
        break;
      case 'weekly':
        newDueDate.setDate(newDueDate.getDate() + 7);
        break;
      case 'monthly':
        newDueDate.setMonth(newDueDate.getMonth() + 1);
        break;
    }

    const recurringTask = {
      ...originalTask,
      dueDate: newDueDate.toISOString().split('T')[0],
      completed: false,
      subtasks: originalTask.subtasks.map(st => ({ ...st, completed: false })),
    };

    

    createTask(recurringTask);
  };

  const addSubtask = (taskId: string, title: string) => {
    const task = tasks.find(t => t.id === taskId);
    if (task) {
      const newSubtask: Subtask = {
        id: Date.now().toString(),
        title,
        completed: false,
        createdAt: new Date().toISOString(),
      };
      updateTask(taskId, {
        subtasks: [...task.subtasks, newSubtask]
      });
    }
  };

  const toggleSubtask = (taskId: string, subtaskId: string) => {
    const task = tasks.find(t => t.id === taskId);
    if (task) {
      const updatedSubtasks = task.subtasks.map(st =>
        st.id === subtaskId ? { ...st, completed: !st.completed } : st
      );
      updateTask(taskId, { subtasks: updatedSubtasks });
    }
  };

  const addAttachment = (taskId: string, attachment: Omit<Attachment, 'id'>) => {
    const task = tasks.find(t => t.id === taskId);
    if (task) {
      const newAttachment: Attachment = {
        ...attachment,
        id: Date.now().toString(),
      };
      updateTask(taskId, {
        attachments: [...task.attachments, newAttachment]
      });
    }
  };

  const incrementPomodoroSession = (taskId: string) => {
    const task = tasks.find(t => t.id === taskId);
    if (task) {
      updateTask(taskId, {
        pomodoroSessions: (task.pomodoroSessions || 0) + 1
      });
    }
  };

  const createProject = (projectData: Omit<Project, 'id' | 'createdAt' | 'tasks'>) => {
    const newProject: Project = {
      ...projectData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      tasks: [],
    };
    setProjects(prev => [...prev, newProject]);
    return newProject;
  };

  const getFilteredTasks = () => {
    let filtered = tasks;

    // Apply text search
    if (searchTerm) {
      filtered = filtered.filter(task => 
        task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        task.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        task.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Apply status filter
    switch (filterType) {
      case 'active':
        filtered = filtered.filter(task => !task.completed);
        break;
      case 'completed':
        filtered = filtered.filter(task => task.completed);
        break;
      case 'overdue':
        filtered = filtered.filter(task => 
          !task.completed && new Date(task.dueDate) < new Date()
        );
        break;
    }

    // Apply sorting
    switch (sortType) {
      case 'dueDate':
        filtered.sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
        break;
      case 'priority':
        const priorityOrder = { high: 3, medium: 2, low: 1 };
        filtered.sort((a, b) => priorityOrder[b.priority] - priorityOrder[a.priority]);
        break;
      case 'created':
        filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
      case 'alphabetical':
        filtered.sort((a, b) => a.title.localeCompare(b.title));
        break;
    }

    return filtered;
  };

  const getTaskStats = () => {
    const total = tasks.length;
    const completed = tasks.filter(t => t.completed).length;
    const overdue = tasks.filter(t => !t.completed && new Date(t.dueDate) < new Date()).length;
    const upcoming = tasks.filter(t => {
      const dueDate = new Date(t.dueDate);
      const today = new Date();
      const threeDaysFromNow = new Date(today.getTime() + 3 * 24 * 60 * 60 * 1000);
      return !t.completed && dueDate >= today && dueDate <= threeDaysFromNow;
    }).length;

    return { total, completed, overdue, upcoming };
  };

  const getAnalytics = () => {
    const today = new Date();
    const thisWeek = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
    const thisMonth = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);

    const completedToday = tasks.filter(t => 
      t.completed && new Date(t.updatedAt).toDateString() === today.toDateString()
    ).length;

    const completedThisWeek = tasks.filter(t => 
      t.completed && new Date(t.updatedAt) >= thisWeek
    ).length;

    const completedThisMonth = tasks.filter(t => 
      t.completed && new Date(t.updatedAt) >= thisMonth
    ).length;

    const totalPomodoroSessions = tasks.reduce((sum, task) => sum + (task.pomodoroSessions || 0), 0);

    const categoryStats = tasks.reduce((acc, task) => {
      if (task.category) {
        acc[task.category] = (acc[task.category] || 0) + 1;
      }
      return acc;
    }, {} as Record<string, number>);

    return {
      completedToday,
      completedThisWeek,
      completedThisMonth,
      totalPomodoroSessions,
      categoryStats,
    };
  };

  return {
    tasks: getFilteredTasks(),
    projects,
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
    addAttachment,
    incrementPomodoroSession,
    createProject,
    getTaskStats,
    getAnalytics,
  };
}