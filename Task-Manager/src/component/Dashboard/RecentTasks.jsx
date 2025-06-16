import React, { useEffect, useState } from 'react';
import { useTaskStore } from '../../store/taskStore';
import { DashboardCard } from './DashboardCard';
import { Clock, CheckCircle, AlertCircle, XCircle } from 'lucide-react';
import Modal from '../common/Modal';
import moment from 'moment';

export const RecentTasks = () => {
  const { tasks, fetchTasks, loading, error } = useTaskStore();
  const [selectedTask, setSelectedTask] = useState(null);

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

  const getStatusIcon = (status) => {
    switch (status) {
      case 0:
        return <Clock className="w-5 h-5 text-yellow-500" />;
      case 1:
        return <AlertCircle className="w-5 h-5 text-blue-500" />;
      case 2:
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 3:
        return <XCircle className="w-5 h-5 text-red-500" />;
      case 4:
        return <XCircle className="w-5 h-5 text-gray-500" />;
      default:
        return <Clock className="w-5 h-5 text-yellow-500" />;
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 0:
        return 'Pending';
      case 1:
        return 'In Progress';
      case 2:
        return 'Completed';
      case 3:
        return 'Cancelled';
      case 4:
        return 'Failed';
      default:
        return 'Unknown';
    }
  };

  const recentTasks = [...tasks]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5);

  if (loading) {
    return <div className="text-center">Loading recent tasks...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500">Error loading tasks: {error}</div>;
  }

  return (
    <DashboardCard title="Recent Tasks">
      <div className="space-y-4">
        {recentTasks.map((task) => (
          <div
            key={task.taskId}
            className="flex items-center justify-between p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 cursor-pointer"
            onClick={() => setSelectedTask(task)}
          >
            <div className="flex items-center space-x-4">
              {getStatusIcon(task.status)}
              <div>
                <h3 className="font-medium text-gray-900">{task.title}</h3>
                <p className="text-sm text-gray-500">{task.description}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                task.status === 0 ? 'bg-yellow-100 text-yellow-800' :
                task.status === 1 ? 'bg-blue-100 text-blue-800' :
                task.status === 2 ? 'bg-green-100 text-green-800' :
                task.status === 3 ? 'bg-red-100 text-red-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                {getStatusText(task.status)}
              </span>
            </div>
          </div>
        ))}
      </div>

      <Modal
        isOpen={!!selectedTask}
        onClose={() => setSelectedTask(null)}
        title="Task Details"
      >
        {selectedTask && (
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              {getStatusIcon(selectedTask.status)}
              <div>
                <h3 className="text-xl font-semibold text-gray-900">{selectedTask.title}</h3>
                <p className="text-sm text-gray-500">{selectedTask.description}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-gray-500">Status</p>
                <p className="mt-1 text-sm text-gray-900">{getStatusText(selectedTask.status)}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Priority</p>
                <p className="mt-1 text-sm text-gray-900">{selectedTask.priority}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Start Date</p>
                <p className="mt-1 text-sm text-gray-900">
                  {moment(selectedTask.startDate).format('MMMM D, YYYY')}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Due Date</p>
                <p className="mt-1 text-sm text-gray-900">
                  {moment(selectedTask.dueDate).format('MMMM D, YYYY')}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Created At</p>
                <p className="mt-1 text-sm text-gray-900">
                  {moment(selectedTask.createdAt).format('MMMM D, YYYY')}
                </p>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </DashboardCard>
  );
};