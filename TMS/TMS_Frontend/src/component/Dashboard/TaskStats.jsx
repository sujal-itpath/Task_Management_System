import React, { useEffect } from 'react';
import { useTaskStore } from '../../store/taskStore';
import { DashboardCard } from './DashboardCard';
import { CheckCircle, Clock, AlertCircle, XCircle } from 'lucide-react';

export const TaskStats = () => {
  const { tasks, fetchTasks, loading, error } = useTaskStore();

  useEffect(() => {
    const loadTasks = async () => {
      try {
        await fetchTasks();
      } catch (err) {
        console.error('Error loading tasks:', err);
      }
    };
    loadTasks();
  }, [fetchTasks]);

  const stats = {
    total: tasks.length,
    completed: tasks.filter(task => task.status === 2).length,
    pending: tasks.filter(task => task.status === 0).length,
    inProgress: tasks.filter(task => task.status === 1).length,
    cancelled: tasks.filter(task => task.status === 3).length,
    failed: tasks.filter(task => task.status === 4).length
  };

  const statItems = [
    {
      title: 'Total Tasks',
      value: stats.total,
      icon: <CheckCircle className="w-5 h-5" />,
      color: 'text-blue-600'
    },
    {
      title: 'Completed',
      value: stats.completed,
      icon: <CheckCircle className="w-5 h-5" />,
      color: 'text-green-600'
    },
    {
      title: 'Pending',
      value: stats.pending,
      icon: <Clock className="w-5 h-5" />,
      color: 'text-yellow-600'
    },
    {
      title: 'In Progress',
      value: stats.inProgress,
      icon: <AlertCircle className="w-5 h-5" />,
      color: 'text-purple-600'
    },
    {
      title: 'Cancelled',
      value: stats.cancelled,
      icon: <XCircle className="w-5 h-5" />,
      color: 'text-red-600'
    },
    {
      title: 'Failed',
      value: stats.failed,
      icon: <XCircle className="w-5 h-5" />,
      color: 'text-red-600'
    }
  ];

  if (loading) {
    return <div className="text-center">Loading statistics...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500">Error loading tasks: {error}</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {statItems.map((stat, index) => (
        <DashboardCard
          key={index}
          title={stat.title}
          icon={stat.icon}
          className="flex flex-col items-center justify-center text-center"
        >
          <div className={`text-4xl font-bold ${stat.color} mb-2`}>
            {stat.value}
          </div>
          <div className="text-sm text-gray-500">
            {stats.total > 0 ? ((stat.value / stats.total) * 100).toFixed(1) : 0}% of total
          </div>
        </DashboardCard>
      ))}
    </div>
  );
};