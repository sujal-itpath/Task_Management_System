import React, { useState } from 'react';
import { useTaskStore } from '../../store/taskStore';
import { TextField, Button, Box, MenuItem, FormControl, InputLabel, Select } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { Formik, Form } from "formik";
import * as Yup from "yup";
import Input from "../common/input";
import { useToast } from "../common/ToastContext";

const TaskForm = ({ task, onClose }) => {
  const { createTask, updateTask } = useTaskStore();
  const { showToast } = useToast();
  const [dueDate, setDueDate] = useState(task?.dueDate ? new Date(task.dueDate) : new Date());

  const initialValues = {
    title: task?.title || '',
    description: task?.description || '',
    status: task?.status || 0,
    dueDate: task?.dueDate || new Date(),
    priority: task?.priority || 'Medium'
  };

  const validationSchema = Yup.object({
    title: Yup.string().required('Title is required'),
    description: Yup.string().required('Description is required'),
    dueDate: Yup.date().required('Due date is required'),
    priority: Yup.string().oneOf(['High', 'Medium', 'Low']).required('Priority is required')
  });

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      console.log('Form submission started with values:', values);
      
      const taskData = {
        title: values.title,
        description: values.description,
        dueDate: dueDate.toISOString(),
        priority: values.priority
      };

      console.log('Prepared task data:', taskData);

      if (task) {
        console.log('Updating existing task:', task.taskId);
        const updatedTask = await updateTask(task.taskId, taskData);
        console.log('Task updated successfully:', updatedTask);
        showToast('Task updated successfully', 'success');
      } else {
        console.log('Creating new task');
        const newTask = await createTask(taskData);
        console.log('Task created successfully:', newTask);
        showToast('Task created successfully', 'success');
      }

      resetForm();
      onClose();
    } catch (error) {
      console.error('Task submission error:', error);
      showToast(error.message || 'An error occurred while saving the task', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
        enableReinitialize
      >
        {({ isSubmitting, errors, touched, values, setFieldValue, handleSubmit: formikSubmit }) => (
          <Form 
            onSubmit={(e) => {
              e.preventDefault();
              console.log('Form submitted');
              formikSubmit(e);
            }} 
            className="space-y-6"
          >
            <Input
              name="title"
              label="Title"
              type="text"
              placeholder="Enter task title"
              error={touched.title && errors.title}
              helperText={touched.title && errors.title}
            />

            <Input
              name="description"
              label="Description"
              type="text"
              multiline
              rows={4}
              placeholder="Enter task description"
              error={touched.description && errors.description}
              helperText={touched.description && errors.description}
            />

            <DatePicker
              label="Due Date"
              value={dueDate}
              onChange={(newValue) => {
                setDueDate(newValue);
                setFieldValue('dueDate', newValue);
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  fullWidth
                  error={touched.dueDate && errors.dueDate}
                  helperText={touched.dueDate && errors.dueDate}
                />
              )}
            />

            <FormControl fullWidth>
              <InputLabel>Priority</InputLabel>
              <Select
                name="priority"
                label="Priority"
                value={values.priority}
                onChange={(e) => setFieldValue('priority', e.target.value)}
                error={touched.priority && errors.priority}
              >
                <MenuItem value="High">High</MenuItem>
                <MenuItem value="Medium">Medium</MenuItem>
                <MenuItem value="Low">Low</MenuItem>
              </Select>
            </FormControl>

            {task && (
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  name="status"
                  label="Status"
                  value={values.status}
                  onChange={(e) => setFieldValue('status', e.target.value)}
                >
                  <MenuItem value={0}>Pending</MenuItem>
                  <MenuItem value={1}>In Progress</MenuItem>
                  <MenuItem value={2}>Completed</MenuItem>
                  <MenuItem value={3}>Cancelled</MenuItem>
                  <MenuItem value={4}>Failed</MenuItem>
                </Select>
              </FormControl>
            )}

            <Box className="flex justify-end space-x-4">
              <Button
                variant="outlined"
                onClick={onClose}
                type="button"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="contained"
                disabled={isSubmitting}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {isSubmitting ? 'Saving...' : task ? 'Update Task' : 'Create Task'}
              </Button>
            </Box>
          </Form>
        )}
      </Formik>
    </LocalizationProvider>
  );
};

export default TaskForm; 