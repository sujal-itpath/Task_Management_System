import React, { useEffect } from "react";
import { useTaskStore } from "../../store/taskStore";
import {
  Card,
  CardContent,
  Typography,
  Chip,
  CircularProgress,
  Grid,
  IconButton,
} from "@mui/material";
import { format } from "date-fns";
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';

const statusColors = {
  0: "bg-yellow-100 text-yellow-800", // Pending
  1: "bg-blue-100 text-blue-800",     // InProgress
  2: "bg-green-100 text-green-800",   // Completed
};

const getStatusText = (status) => {
  switch (status) {
    case 0: return "Pending";
    case 1: return "In Progress";
    case 2: return "Completed";
    default: return "Unknown";
  }
};

const TaskCard = () => {
  const { tasks, fetchTasks, loading, error } = useTaskStore();

  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <div className="p-6">
      <Typography variant="h4" className="mb-6 text-blue-700 font-bold">
        Task Overview
      </Typography>

      {loading ? (
        <div className="flex justify-center items-center h-40">
          <CircularProgress />
        </div>
      ) : error ? (
        <Typography color="error">Error: {error}</Typography>
      ) : tasks.length === 0 ? (
        <Typography>No tasks available.</Typography>
      ) : (
        <Grid container spacing={3}>
          {tasks.map((task) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={task.taskId}>
              <Card className="shadow-md hover:shadow-xl transition-all duration-300 rounded-2xl border border-gray-100">
                <CardContent>
                  <div className="flex justify-between items-start mb-2">
                    <Typography variant="h6" className="font-semibold">
                      {task.title}
                    </Typography>
                    <Chip
                      label={getStatusText(task.status)}
                      className={`text-xs px-2 py-1 rounded-full ${statusColors[task.status]}`}
                    />
                  </div>

                  <Typography variant="body2" color="textSecondary">
                    Due: {format(new Date(task.dueDate), "dd MMM yyyy")}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Created: {format(new Date(task.createdAt), "dd MMM yyyy")}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </div>
  );
};

export default TaskCard;
