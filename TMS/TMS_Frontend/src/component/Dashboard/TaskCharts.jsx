import React, { useEffect } from 'react';
import { useTaskStore } from '../../store/taskStore';
import { DashboardCard } from './DashboardCard';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';

export const TaskCharts = () => {
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

  const statusData = [
    { name: 'Pending', value: tasks.filter(task => task.status === 0).length },
    { name: 'In Progress', value: tasks.filter(task => task.status === 1).length },
    { name: 'Completed', value: tasks.filter(task => task.status === 2).length },
    { name: 'Cancelled', value: tasks.filter(task => task.status === 3).length },
    { name: 'Failed', value: tasks.filter(task => task.status === 4).length },
  ];

  const COLORS = ['#FFB020', '#14B8A6', '#5048E5', '#D14343', '#637381'];

  const priorityData = [
    { name: 'High', value: tasks.filter(task => task.priority === 'High').length },
    { name: 'Medium', value: tasks.filter(task => task.priority === 'Medium').length },
    { name: 'Low', value: tasks.filter(task => task.priority === 'Low').length },
  ];

  if (loading) {
    return <div className="text-center py-6">Loading charts...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500 py-6">Error loading tasks: {error}</div>;
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Status Pie Chart */}
      <DashboardCard title="📊 Task Status Distribution">
        <div className="h-[320px] pt-4">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={statusData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
                
              >
                {statusData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
              <Legend verticalAlign="bottom" height={36} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </DashboardCard>

      {/* Priority Bar Chart */}
      <DashboardCard title="📈 Task Priority Overview">
        <div className="h-[320px] pt-4">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={priorityData} barCategoryGap="25%">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="name"
                tick={{ fontSize: 14 }}
                axisLine={{ stroke: '#ccc' }}
              />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" fill="#5048E5" barSize={40} radius={[10, 10, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </DashboardCard>
    </div>
  );
};
