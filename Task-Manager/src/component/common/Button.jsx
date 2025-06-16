import React from "react";
import { Button as MuiButton, CircularProgress } from "@mui/material";
import { Loader2 } from "lucide-react";

const Button = ({
  type = "button",
  children,
  onClick,
  variant = "contained", // MUI variants: "contained", "outlined", "text"
  color = "primary",      // MUI colors: "primary", "secondary", "error", etc.
  size = "medium",        // "small", "medium", "large"
  disabled = false,
  loading = false,
  icon: Icon,
  fullWidth = false,
  className = "",
  ...props
}) => {
  return (
    <MuiButton
      type={type}
      onClick={onClick}
      variant={variant}
      color={color}
      size={size}
      disabled={disabled || loading}
      fullWidth={fullWidth}
      className={className}
      startIcon={
        loading ? (
          <CircularProgress size={20} color="inherit" />
        ) : Icon ? (
          <Icon size={20} />
        ) : null
      }
      {...props}
    >
      {children}
    </MuiButton>
  );
};

export default Button;
