import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Typography,
  Alert,
  Box,
  Select,
  MenuItem,
  FormControl,
} from "@mui/material";
import useAuthStore from "../../store/authStore";
import { format } from "date-fns";

const UserTable = () => {
  const { users, getAllUsers, updateUserRole, loading, error } = useAuthStore();
  const [localError, setLocalError] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        await getAllUsers();
      } catch (err) {
        setLocalError(err.message);
      }
    };
    fetchUsers();
  }, [getAllUsers]);

  const handleRoleChange = async (userId, newRole) => {
    try {
      await updateUserRole(userId, newRole);
      setLocalError(null);
    } catch (err) {
      setLocalError(err.message);
    }
  };

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

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <Typography variant="h4" className="text-blue-700 font-bold">
          User Management
        </Typography>
      </div>

      <TableContainer component={Paper} className="shadow-md rounded-lg">
        <Table>
          <TableHead>
            <TableRow className="bg-gray-50">
              <TableCell className="font-semibold">Name</TableCell>
              <TableCell className="font-semibold">Email</TableCell>
              <TableCell className="font-semibold">Role</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} align="center">
                  No users available.
                </TableCell>
              </TableRow>
            ) : (
              users.map((user) => (
                <TableRow key={user.id} hover>
                  <TableCell>{user.fullName || user.name || 'N/A'}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <FormControl size="small" sx={{ minWidth: 120 }}>
                      <Select
                        value={user.role || "User"}
                        onChange={(e) => handleRoleChange(user.id, e.target.value)}
                        size="small"
                      >
                        <MenuItem value="Admin">Admin</MenuItem>
                        <MenuItem value="User">User</MenuItem>
                      </Select>
                    </FormControl>
                  </TableCell>
             
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default UserTable;
