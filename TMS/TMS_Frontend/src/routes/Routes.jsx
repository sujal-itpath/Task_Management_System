// src/Routes.jsx
import React from "react";
import { Routes as ReactRoutes, Route, Navigate } from "react-router-dom";

import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import ForgotPassword from "../pages/auth/ForgotPassword";
import ResetPassword from "../pages/auth/ResetPassword";

import PublicRoute from "./PublicRoute";
import ProtectedRoute from "./ProtectedRoute";
import Home from "../pages/Tasks/Home";
import NotFound from "../pages/Error/NotFound";
import Task from "../pages/Tasks/Task";
import UserList from "../pages/auth/UserList";

const Routes = () => {
  return (
    <ReactRoutes>
      {/* Public Routes */}
      <Route
        path="/login"
        element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        }
      />
      <Route
        path="/register"
        element={
          <PublicRoute>
            <Register />
          </PublicRoute>
        }
      />
      <Route
        path="/forgot-password"
        element={
          <PublicRoute>
            <ForgotPassword />
          </PublicRoute>
        }
      />
      <Route
        path="/reset-password"
        element={
          <PublicRoute>
            <ResetPassword />
          </PublicRoute>
        }
      />

      {/* Protected Routes */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        }
      />
      <Route
        path="/task"
        element={
          <ProtectedRoute>
            <Task />
          </ProtectedRoute>
        }
      />
      <Route
        path="/user-list"
        element={
          <ProtectedRoute>
            <UserList />
          </ProtectedRoute>
        }
      />

      {/* Default Redirect */}
      {/* <Route path="/" element={<Navigate to="/dashboard" replace />} /> */}

      {/* 404 Page */}
      <Route path="*" element={<NotFound />} />
    </ReactRoutes>
  );
};

export default Routes;
