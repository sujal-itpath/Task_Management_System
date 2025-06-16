import React from 'react';
import { TaskStats } from './TaskStats';
import { TaskCharts } from './TaskCharts';
import { TaskCalendar } from './TaskCalendar';
import { RecentTasks } from './RecentTasks';
import { useTaskStore } from '../../store/taskStore';

export const Dashboard = () => {
  const { loading } = useTaskStore();

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-2">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500">Welcome to your task management dashboard</p>
      </div>

      <TaskStats />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentTasks /> 
        <TaskCalendar />
      </div>

      <TaskCharts />
    </div>
  );
};