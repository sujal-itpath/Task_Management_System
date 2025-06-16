import { useField } from "formik";
import TextField from "@mui/material/TextField";

const Input = ({ label, ...props }) => {
  const [field, meta] = useField(props);

  return (
    <TextField
      fullWidth
      {...field}
      {...props}
      label={label}
      error={Boolean(meta.touched && meta.error)}
      helperText={meta.touched && meta.error ? meta.error : ""}
      variant="outlined"
      margin="normal"
    />
  );
};

export default Input;
