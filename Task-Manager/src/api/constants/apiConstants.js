// src/constants/api.js

export const API_BASE_URL = "https://localhost:7100/api";

export const API_URL = {
  AUTH: {
    LOGIN: `${API_BASE_URL}/Auth/login`,
    REGISTER: `${API_BASE_URL}/Auth/register`,
    FORGOT_PASSWORD: `${API_BASE_URL}/Auth/forgot-password`,
    RESET_PASSWORD: `${API_BASE_URL}/Auth/reset-password`,
    GET_ALL_USERS: `${API_BASE_URL}/Auth/users`,
    UPDATE_USER_ROLE: `${API_BASE_URL}/Auth/update-role`,
  },
  TASK: {
    GET_TASKS_BY_USER: `${API_BASE_URL}/task/user`,
    GET_ALL_TASKS: `${API_BASE_URL}/task`,
    GET_TASK_BY_ID: (id) => `${API_BASE_URL}/task/${id}`,
    CREATE_TASK: `${API_BASE_URL}/task`,
    UPDATE_TASK: (id) => `${API_BASE_URL}/task/${id}`,
    DELETE_TASK: (id) => `${API_BASE_URL}/task/${id}`,
  },
};
