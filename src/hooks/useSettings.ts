import { useLocalStorage } from './useLocalStorage';
import { AppSettings } from '../types';

export function useSettings() {
  const [settings, setSettings] = useLocalStorage<AppSettings>('taskflow-settings', {
    darkMode: false,
    notifications: true,
    soundEnabled: true,
    emailReminders: false,
  });

  const updateSetting = <K extends keyof AppSettings>(key: K, value: AppSettings[K]) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const toggleDarkMode = () => {
    updateSetting('darkMode', !settings.darkMode);
  };

  return {
    settings,
    updateSetting,
    toggleDarkMode,
  };
}
