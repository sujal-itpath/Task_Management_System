import React, { useEffect, useState } from 'react';
import { useTaskStore } from '../../store/taskStore';
import { DashboardCard } from './DashboardCard';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import Modal from '../common/Modal';
import { Clock, CheckCircle, AlertCircle, XCircle } from 'lucide-react';

const localizer = momentLocalizer(moment);

export const TaskCalendar = () => {
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

  const events = tasks.map(task => ({
    id: task.taskId,
    title: task.title,
    start: new Date(task.startDate),
    end: new Date(task.dueDate),
    status: task.status,
    description: task.description,
    priority: task.priority
  }));

  const eventStyleGetter = (event) => {
    let backgroundColor = '#5048E5';
    switch (event.status) {
      case 0: // Pending
        backgroundColor = '#FFB020';
        break;
      case 1: // In Progress
        backgroundColor = '#14B8A6';
        break;
      case 2: // Completed
        backgroundColor = '#5048E5';
        break;
      case 3: // Cancelled
        backgroundColor = '#D14343';
        break;
      case 4: // Failed
        backgroundColor = '#637381';
        break;
      default:
        backgroundColor = '#5048E5';
    }

    return {
      style: {
        backgroundColor,
        borderRadius: '4px',
        opacity: 0.8,
        color: 'white',
        border: '0px',
        display: 'block'
      }
    };
  };

  const handleEventClick = (event) => {
    setSelectedTask(event);
  };

  if (loading) {
    return <div className="text-center">Loading calendar...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500">Error loading tasks: {error}</div>;
  }

  return (
    <DashboardCard title="Task Calendar" className="h-[600px]">
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: '100%' }}
        eventPropGetter={eventStyleGetter}
        views={['month', 'week', 'day']}
        defaultView="month"
        onSelectEvent={handleEventClick}
      />

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
                  {moment(selectedTask.start).format('MMMM D, YYYY')}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Due Date</p>
                <p className="mt-1 text-sm text-gray-900">
                  {moment(selectedTask.end).format('MMMM D, YYYY')}
                </p>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </DashboardCard>
  );
};