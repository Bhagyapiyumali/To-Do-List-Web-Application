import React from 'react';
import { DivideIcon as LucideIcon } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: number;
  icon: LucideIcon;
  color: 'blue' | 'green' | 'yellow' | 'red';
  darkMode?: boolean;
}

export function StatsCard({ title, value, icon: Icon, color, darkMode = false }: StatsCardProps) {
  const colorClasses = {
    blue: darkMode 
      ? 'bg-blue-900/50 text-blue-400 border-blue-800'
      : 'bg-blue-50 text-blue-600 border-blue-200',
    green: darkMode
      ? 'bg-green-900/50 text-green-400 border-green-800'
      : 'bg-green-50 text-green-600 border-green-200',
    yellow: darkMode
      ? 'bg-yellow-900/50 text-yellow-400 border-yellow-800'
      : 'bg-yellow-50 text-yellow-600 border-yellow-200',
    red: darkMode
      ? 'bg-red-900/50 text-red-400 border-red-800'
      : 'bg-red-50 text-red-600 border-red-200',
  };

  return (
    <div className={`rounded-xl border p-6 transition-colors duration-200 ${colorClasses[color]}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium opacity-75">{title}</p>
          <p className="text-2xl font-bold">{value}</p>
        </div>
        <Icon size={24} className="opacity-75" />
      </div>
    </div>
  );
}