import { useEffect } from 'react';
import { Task } from '../types';

export function useNotifications(tasks: Task[], soundEnabled: boolean) {
  useEffect(() => {
    const checkReminders = () => {
      const now = new Date();
      
      tasks.forEach(task => {
        if (task.reminderTime && !task.completed) {
          const reminderTime = new Date(task.reminderTime);
          const timeDiff = reminderTime.getTime() - now.getTime();
          
          // Show notification if reminder is within 1 minute
          if (timeDiff > 0 && timeDiff <= 60000) {
            showNotification(task);
          }
        }
      });
    };

    const showNotification = (task: Task) => {
      if ('Notification' in window && Notification.permission === 'granted') {
        const notification = new Notification(`Task Reminder: ${task.title}`, {
          body: task.description || 'You have a task due soon!',
          icon: '/vite.svg',
          tag: task.id,
        });

        notification.onclick = () => {
          window.focus();
          notification.close();
        };

        if (soundEnabled) {
          playNotificationSound();
        }
      }
    };

    const playNotificationSound = () => {
      const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIG2m98OScTgwOUarm7blmGgU7k9n1unEiBC13yO/eizEIHWq+8+OWT');
      audio.volume = 0.3;
      audio.play().catch(() => {
        // Ignore audio play errors
      });
    };

    // Request notification permission
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }

    const interval = setInterval(checkReminders, 30000); // Check every 30 seconds
    return () => clearInterval(interval);
  }, [tasks, soundEnabled]);
}