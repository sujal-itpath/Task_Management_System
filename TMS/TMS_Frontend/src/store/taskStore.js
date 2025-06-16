import { create } from "zustand";
import axios from "axios";
import { API_URL } from "../api/constants/apiConstants"; // Adjust the path as needed
import useAuthStore from "./authStore";

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL.BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to add auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const useTaskStore = create((set, get) => ({
  tasks: [],
  loading: false,
  error: null,

  // Helper function to convert string status to number
  convertStatusToNumber: (status) => {
    if (typeof status === 'number') return status;
    
    const statusMap = {
      'Pending': 0,
      'InProgress': 1,
      'Completed': 2,
      'Cancelled': 3,
      'Failed': 4
    };
    return statusMap[status] ?? 0; // Default to 0 (Pending) if status is unknown
  },

  // ✅ Get All Tasks for current user (via API)
  fetchTasks: async () => {
    set({ loading: true, error: null });
    try {
      const userId = useAuthStore.getState().user?.id;
      
      if (!userId) {
        throw new Error("User not authenticated");
      }

      const response = await api.get(`${API_URL.TASK.GET_TASKS_BY_USER}?userId=${userId}`);

      // Ensure status is a number for all tasks
      const tasksWithNumericStatus = response.data.map(task => {
        const numericStatus = get().convertStatusToNumber(task.status);
        return {
          ...task,
          status: numericStatus
        };
      });


      set({ tasks: tasksWithNumericStatus, loading: false });
      return tasksWithNumericStatus;
    } catch (err) {
      set({ error: err.message, loading: false });
      throw err;
    }
  },

  // ✅ Get Task by ID
  getTaskById: async (id) => {
    try {
      const userId = useAuthStore.getState().user?.id;
      
      if (!userId) {
        throw new Error("User not authenticated");
      }

      const response = await api.get(API_URL.TASK.GET_TASK_BY_ID.replace("{id}", id));
      
      // Check if the task belongs to the current user
      if (!response.data.assignedToUserIds?.includes(userId)) {
        throw new Error("Unauthorized access to task");
      }
      return response.data;
    } catch (err) {
      set({ error: err.message });
      throw err;
    }
  },

  // ✅ Create Task
  createTask: async (taskData) => {
    set({ loading: true, error: null });
    try {
      const userId = useAuthStore.getState().user?.id;
      console.log("taskStore - Current userId:", userId);
      
      if (!userId) {
        throw new Error("User not authenticated");
      }

      // Format the task data according to the API requirements
      const formattedTaskData = {
        title: taskData.title,
        description: taskData.description,
        status: 0, // Always set to Pending (0) for new tasks
        dueDate: taskData.dueDate,
        assignedToUserIds: [userId], // Add the current user's ID to assignedToUserIds
      };

      
      const response = await api.post(API_URL.TASK.CREATE_TASK, formattedTaskData);
      console.log("taskStore - API Response:", response.data);
      
      // Update local state with the new task
      set((state) => ({ 
        tasks: [...state.tasks, response.data],
        loading: false 
      }));
      
      return response.data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to create task';
      set({ error: errorMessage, loading: false });
      throw new Error(errorMessage);
    }
  },

  // ✅ Update Task
  updateTask: async (id, updatedData) => {
    set({ loading: true, error: null });
    try {
      const userId = useAuthStore.getState().user?.id;
      
      if (!userId) {
        throw new Error("User not authenticated");
      }

      const task = get().tasks.find(t => t.taskId === id);
      if (!task) {
        throw new Error("Task not found");
      }

      // Format the update data according to the API requirements
      const formattedTaskData = {
        title: updatedData.title,
        description: updatedData.description,
        status: get().convertStatusToNumber(updatedData.status), // Ensure status is a number
        dueDate: updatedData.dueDate,
        assignedToUserIds: task.assignedToUserIds || [userId] // Preserve existing assignments
      };

      const url = API_URL.TASK.UPDATE_TASK(id);
      
      const response = await api.put(url, formattedTaskData);
      
      // Update local state with the new data
      set((state) => ({
        tasks: state.tasks.map((task) =>
          task.taskId === id ? { ...task, ...response.data } : task
        ),
        loading: false
      }));

      return response.data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to update task';
      set({ error: errorMessage, loading: false });
      throw new Error(errorMessage);
    }
  },

  // ✅ Delete Task
  deleteTask: async (id) => {
    set({ loading: true, error: null });
    try {
      const userId = useAuthStore.getState().user?.id;
      
      if (!userId) {
        throw new Error("User not authenticated");
      }

      const task = get().tasks.find(t => t.taskId === id);
      if (!task) {
        throw new Error("Task not found");
      }

      const url = API_URL.TASK.DELETE_TASK(id);
      await api.delete(url);
      
      set((state) => ({
        tasks: state.tasks.filter((task) => task.taskId !== id),
        loading: false
      }));
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to delete task';
      set({ error: errorMessage, loading: false });
      throw new Error(errorMessage);
    }
  },

  // ✅ Update Task Status
  handleStatusChange: async (taskId, newStatus) => {
    set({ loading: true, error: null });
    try {
      const task = get().tasks.find(t => t.taskId === taskId);
      if (!task) {
        throw new Error("Task not found");
      }

      const dto = {
        ...task,
        status: get().convertStatusToNumber(newStatus)
      };

      const url = API_URL.TASK.UPDATE_TASK(taskId);
      
      const response = await api.put(url, dto);
      
      // Update local state
      set((state) => ({
        tasks: state.tasks.map((task) =>
          task.taskId === taskId ? { ...task, status: dto.status } : task
        ),
        loading: false
      }));

      return response.data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to update task status';
      set({ error: errorMessage, loading: false });
      throw new Error(errorMessage);
    }
  }
}));
