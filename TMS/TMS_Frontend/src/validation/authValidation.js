import * as Yup from "yup";

export const registerValidationSchema = Yup.object({
  firstName: Yup.string()
    .required("First name is required")
    .min(2, "Too short"),

  lastName: Yup.string()
    .required("Last name is required")
    .min(2, "Too short"),

  phone: Yup.string()
    .matches(/^[0-9]{10}$/, "Phone number must be 10 digits")
    .required("Phone number is required"),

  email: Yup.string()
    .email("Invalid email format")
    .required("Email is required"),

  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),

  profileImage: Yup.mixed()
    .nullable()
    .required("Profile image is required")
    .test("fileSize", "File too large", value => !value || value.size <= 2 * 1024 * 1024)
    .test("fileFormat", "Unsupported format", value =>
      !value || ["image/jpeg", "image/png", "image/webp"].includes(value.type)
    ),
});

export const loginValidationSchema = Yup.object({
  email: Yup.string()
    .email("Invalid email format")
    .required("Email is required"),

  password: Yup.string()
    .required("Password is required"),
});
