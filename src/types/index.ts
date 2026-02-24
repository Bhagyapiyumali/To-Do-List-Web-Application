export interface Task {
  id: string;
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  category: string;
  dueDate: string;
  completed: boolean;
  createdAt: string;
  updatedAt: string;
  assignedTo?: string;
  projectId?: string;
  tags: string[];
  subtasks: Subtask[];
  attachments: Attachment[];
  reminderTime?: string;
  isRecurring?: boolean;
  recurringType?: 'daily' | 'weekly' | 'monthly';
  pomodoroSessions?: number;
}

export interface Subtask {
  id: string;
  title: string;
  completed: boolean;
  createdAt: string;
}

export interface Attachment {
  id: string;
  name: string;
  url: string;
  type: 'file' | 'link';
  size?: number;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  color: string;
  createdAt: string;
  tasks: string[];
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

export interface AppSettings {
  darkMode: boolean;
  notifications: boolean;
  soundEnabled: boolean;
  emailReminders: boolean;
}

export type ViewMode = 'list' | 'board' | 'calendar' | 'analytics';
export type FilterType = 'all' | 'active' | 'completed' | 'overdue';
export type SortType = 'dueDate' | 'priority' | 'created' | 'alphabetical';