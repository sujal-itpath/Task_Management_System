import React, { useState, useEffect } from "react";
import { useTaskStore } from "../../store/taskStore";
import useAuthStore from "../../store/authStore";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Chip,
  CircularProgress,
  Typography,
  Button,
  Alert,
  Box,
  LinearProgress,
  Select,
  MenuItem,
  FormControl,
  TextField,
  Grid,
  InputLabel,
} from "@mui/material";
import { Edit as EditIcon, Delete as DeleteIcon, Visibility as ViewIcon, Search as SearchIcon } from "@mui/icons-material";
import { format } from "date-fns";
import Modal from "../common/Modal";
import TaskForm from "./TaskForm";
import { useNavigate } from "react-router-dom";
import { useToast } from '../common/ToastContext';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

const statusColors = {
  0: "warning", // Pending
  1: "info",    // InProgress
  2: "success", // Completed
  3: "error",   // Cancelled
  4: "error",   // Failed
};

const getStatusText = (status) => {
  console.log('Status value received:', status, 'Type:', typeof status);
  const numericStatus = Number(status);
  console.log('Converted status in table:', numericStatus, 'Type:', typeof numericStatus);
  switch (numericStatus) {
    case 0: return "Pending";
    case 1: return "In Progress";
    case 2: return "Completed";
    case 3: return "Cancelled";
    case 4: return "Failed";
    default: return "Unknown";
  }
};

const TaskTable = () => {
  const {
    tasks,
    fetchTasks,
    deleteTask,
    loading,
    error,
    handleStatusChange,
  } = useTaskStore();

  const { user, loadUserFromToken } = useAuthStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [localError, setLocalError] = useState(null);
  const navigate = useNavigate();
  const { showToast } = useToast();

  // Search and filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dueDateFilter, setDueDateFilter] = useState(null);

  // Load user from token on mount
  useEffect(() => {
    loadUserFromToken();
  }, [loadUserFromToken]);

  // Fetch tasks when user is loaded
  useEffect(() => {
    if (user?.id) {
      fetchTasks().catch((err) => {
        setLocalError(err.message);
        showToast(err.message, 'error');
      });
    }
  }, [user, fetchTasks, showToast]);

  // Filter tasks based on search query and filters
  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || task.status === Number(statusFilter);
    const matchesDueDate = !dueDateFilter || format(new Date(task.dueDate), 'yyyy-MM-dd') === format(dueDateFilter, 'yyyy-MM-dd');
    
    return matchesSearch && matchesStatus && matchesDueDate;
  });

  const handleAddTask = () => {
    if (!user) {
      setLocalError("Please login to create tasks");
      showToast("Please login to create tasks", 'error');
      return;
    }
    setSelectedTask(null);
    setIsModalOpen(true);
  };

  const handleEditTask = (task) => {
    if (!user) {
      setLocalError("Please login to edit tasks");
      showToast("Please login to edit tasks", 'error');
      return;
    }
    setSelectedTask(task);
    setIsModalOpen(true);
  };

  const handleViewTask = (task) => {
    setSelectedTask(task);
    setIsViewModalOpen(true);
  };

  const handleDeleteTask = async (taskId) => {
    if (!user) {
      setLocalError("Please login to delete tasks");
      showToast("Please login to delete tasks", 'error');
      return;
    }
    if (window.confirm("Are you sure you want to delete this task?")) {
      try {
        await deleteTask(taskId);
        setLocalError(null);
        showToast("Task deleted successfully", 'success');
      } catch (err) {
        setLocalError(err.message);
        showToast(err.message, 'error');
      }
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedTask(null);
    setLocalError(null);
  };

  const handleCloseViewModal = () => {
    setIsViewModalOpen(false);
    setSelectedTask(null);
  };

  const handleLogin = () => {
    navigate("/login");
  };

  if (!user) {
    return (
      <Box className="space-y-4">
        <Alert severity="info" className="mb-4">
          Please login to view and manage your tasks.
        </Alert>
        <Box className="flex justify-center">
          <Button
            variant="contained"
            color="primary"
            onClick={handleLogin}
            className="bg-blue-600 hover:bg-blue-700"
          >
            Go to Login
          </Button>
        </Box>
      </Box>
    );
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-40">
        <CircularProgress />
      </div>
    );
  }

  if (error || localError) {
    return (
      <Alert severity="error" className="mb-4">
        {error || localError}
      </Alert>
    );
  }

  const TaskDetailsModal = () => {
    if (!selectedTask) return null;

    return (
      <Modal
        isOpen={isViewModalOpen}
        onClose={handleCloseViewModal}
        title="Task Details"
        width="max-w-2xl"
        footer={
          <div className="flex justify-end gap-2">
            <Button
              variant="outlined"
              color="primary"
              onClick={() => {
                handleCloseViewModal();
                handleEditTask(selectedTask);
              }}
            >
              Edit Task
            </Button>
            <Button variant="outlined" onClick={handleCloseViewModal}>
              Close
            </Button>
          </div>
        }
      >
        <div className="space-y-4">
          <div>
            <h3 className="text-xl font-semibold mb-2">{selectedTask.title}</h3>
            <p className="text-gray-600">{selectedTask.description}</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium text-gray-700 mb-1">Status</h4>
              <Chip
                label={getStatusText(selectedTask.status)}
                color={statusColors[selectedTask.status]}
                size="small"
              />
            </div>

            <div>
              <h4 className="font-medium text-gray-700 mb-1">Priority</h4>
              <Chip
                label={selectedTask.priority || 'Medium'}
                size="small"
                sx={{
                  bgcolor: selectedTask.priority?.toLowerCase() === 'high' ? '#f44336' :
                          selectedTask.priority?.toLowerCase() === 'medium' ? '#ff9800' : '#4caf50',
                  color: 'white',
                  fontWeight: 500,
                }}
              />
            </div>

            <div>
              <h4 className="font-medium text-gray-700 mb-1">Due Date</h4>
              <p className="text-gray-600">
                {format(new Date(selectedTask.dueDate), 'MMMM dd, yyyy')}
              </p>
            </div>

            <div>
              <h4 className="font-medium text-gray-700 mb-1">Created At</h4>
              <p className="text-gray-600">
                {format(new Date(selectedTask.createdAt), 'MMMM dd, yyyy')}
              </p>
            </div>

            <div>
              <h4 className="font-medium text-gray-700 mb-1">Assigned To</h4>
              <p className="text-gray-600">
                {selectedTask.assignedToUserIds?.[0] || 'Unassigned'}
              </p>
            </div>
          </div>

          <div>
            <h4 className="font-medium text-gray-700 mb-1">Progress</h4>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <LinearProgress
                variant="determinate"
                value={selectedTask.status === 2 ? 100 : selectedTask.status === 1 ? 50 : 0}
                sx={{
                  flexGrow: 1,
                  height: 8,
                  borderRadius: 4,
                  bgcolor: '#e0e0e0',
                  '& .MuiLinearProgress-bar': {
                    borderRadius: 4,
                  },
                }}
              />
              <Typography variant="body2" color="text.secondary">
                {selectedTask.status === 2 ? '100%' : selectedTask.status === 1 ? '50%' : '0%'}
              </Typography>
            </Box>
          </div>
        </div>
      </Modal>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <Typography variant="h4" className="text-blue-700 font-bold">
          My Tasks
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={handleAddTask}
          className="bg-blue-600 hover:bg-blue-700"
        >
          Add New Task
        </Button>
      </div>

      {/* Search and Filter Section */}
      <Grid container spacing={2} className="mb-4">
        <Grid item xs={12} md={4}>
          <TextField
            fullWidth
            label="Search Tasks"
            variant="outlined"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              startAdornment: <SearchIcon className="text-gray-400 mr-2" />,
            }}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <FormControl fullWidth>
            <InputLabel>Status</InputLabel>
            <Select
              value={statusFilter}
              label="Status"
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <MenuItem value="all">All Status</MenuItem>
              <MenuItem value={0}>Pending</MenuItem>
              <MenuItem value={1}>In Progress</MenuItem>
              <MenuItem value={2}>Completed</MenuItem>
              <MenuItem value={3}>Cancelled</MenuItem>
              <MenuItem value={4}>Failed</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} md={4}>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker
              label="Due Date"
              value={dueDateFilter}
              onChange={(newValue) => setDueDateFilter(newValue)}
              renderInput={(params) => (
                <TextField {...params} fullWidth />
              )}
            />
          </LocalizationProvider>
        </Grid>
      </Grid>

      <TableContainer component={Paper} className="shadow-md rounded-lg">
        <Table>
          <TableHead>
            <TableRow className="bg-gray-50">
              <TableCell className="font-semibold">Title</TableCell>
              <TableCell className="font-semibold">Status</TableCell>
              <TableCell className="font-semibold">Due Date</TableCell>
              <TableCell className="font-semibold">Created At</TableCell>
              <TableCell className="font-semibold">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredTasks.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  {tasks.length === 0 ? "No tasks available. Create your first task!" : "No tasks match your search criteria."}
                </TableCell>
              </TableRow>
            ) : (
              filteredTasks.map((task) => (
                <TableRow 
                  key={task.taskId} 
                  hover 
                  onClick={() => handleViewTask(task)}
                  sx={{ cursor: 'pointer' }}
                >
                  <TableCell>{task.title}</TableCell>
                  <TableCell>
                    <FormControl 
                      size="small" 
                      onClick={(e) => e.stopPropagation()}
                      sx={{ minWidth: 120 }}
                    >
                      <Select
                        value={task.status}
                        onChange={(e) => handleStatusChange(task.taskId, e.target.value)}
                        size="small"
                        sx={{
                          '& .MuiSelect-select': {
                            py: 0.5,
                          },
                          '& .MuiOutlinedInput-notchedOutline': {
                            border: 'none',
                          },
                          '&:hover .MuiOutlinedInput-notchedOutline': {
                            border: 'none',
                          },
                          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                            border: 'none',
                          },
                        }}
                      >
                        <MenuItem value={0}>
                          <Chip
                            label="Pending"
                            color="warning"
                            size="small"
                            sx={{ width: '100%' }}
                          />
                        </MenuItem>
                        <MenuItem value={1}>
                          <Chip
                            label="In Progress"
                            color="info"
                            size="small"
                            sx={{ width: '100%' }}
                          />
                        </MenuItem>
                        <MenuItem value={2}>
                          <Chip
                            label="Completed"
                            color="success"
                            size="small"
                            sx={{ width: '100%' }}
                          />
                        </MenuItem>
                        <MenuItem value={3}>
                          <Chip
                            label="Cancelled"
                            color="error"
                            size="small"
                            sx={{ width: '100%' }}
                          />
                        </MenuItem>
                        <MenuItem value={4}>
                          <Chip
                            label="Failed"
                            color="error"
                            size="small"
                            sx={{ width: '100%' }}
                          />
                        </MenuItem>
                      </Select>
                    </FormControl>
                  </TableCell>
                  <TableCell>
                    {format(new Date(task.dueDate), "dd MMM yyyy")}
                  </TableCell>
                  <TableCell>
                    {format(new Date(task.createdAt), "dd MMM yyyy")}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
                      <IconButton
                        size="small"
                        onClick={() => handleEditTask(task)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => handleDeleteTask(task.taskId)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={selectedTask ? "Edit Task" : "Add New Task"}
      >
        <TaskForm task={selectedTask} onClose={handleCloseModal} />
      </Modal>

      <TaskDetailsModal />
    </div>
  );
};

export default TaskTable;
