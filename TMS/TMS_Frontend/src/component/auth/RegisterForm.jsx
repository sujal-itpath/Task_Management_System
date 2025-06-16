import React, { useEffect } from "react";
import { Formik, Form } from "formik";
import Input from "../common/input";
import { Link } from "react-router-dom";
import Button from "../common/Button";
import { useToast } from "../common/ToastContext";
import { registerValidationSchema } from "../../validation/authValidation";
import useAuthStore from "../../store/authStore";

const RegisterForm = () => {
  const { showToast } = useToast();
  const { register, success, error, loading } = useAuthStore();

  // Show toast on success or error
  useEffect(() => {
    if (success) showToast("Registered successfully!", "success");
    if (error) showToast(error, "error");
  }, [success, error, showToast]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-blue-50 px-4">
      <div className="w-full max-w-lg bg-white rounded-3xl shadow-lg p-10 sm:p-12">
        <h2 className="text-4xl font-extrabold mb-8 text-center text-blue-700 drop-shadow-sm">
          Create an Account
        </h2>

        <Formik
          initialValues={{
            firstName: "",
            lastName: "",
            phone: "",
            email: "",
            password: "",
            profileImage: null,
          }}
          validationSchema={registerValidationSchema}
          onSubmit={async (values, actions) => {
            const formData = new FormData();
            formData.append("FirstName", values.firstName);
            formData.append("LastName", values.lastName);
            formData.append("PhoneNumber", values.phone);
            formData.append("Email", values.email);
            formData.append("Password", values.password);
            if (values.profileImage) {
              formData.append("ProfileImage", values.profileImage);
            }

            await register(formData);
            actions.setSubmitting(false);
            actions.resetForm();
          }}
        >
          {({
            values,
            errors,
            touched,
            isSubmitting,
            setFieldValue,
            handleChange,
            handleBlur,
          }) => (
            <Form noValidate>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <Input
                  label="First Name"
                  name="firstName"
                  placeholder="Sujal"
                  value={values.firstName}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={errors.firstName}
                  touched={touched.firstName}
                  disabled={isSubmitting}
                  className="bg-blue-50"
                />
                <Input
                  label="Last Name"
                  name="lastName"
                  placeholder="Gupta"
                  value={values.lastName}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={errors.lastName}
                  touched={touched.lastName}
                  disabled={isSubmitting}
                  className="bg-blue-50"
                />
                <Input
                  label="Phone Number"
                  name="phone"
                  placeholder="9876543210"
                  value={values.phone}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={errors.phone}
                  touched={touched.phone}
                  disabled={isSubmitting}
                  className="bg-blue-50"
                />
                <Input
                  label="Email"
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                  value={values.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={errors.email}
                  touched={touched.email}
                  disabled={isSubmitting}
                  className="bg-blue-50"
                />
                <Input
                  label="Password"
                  name="password"
                  type="password"
                  placeholder="********"
                  value={values.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={errors.password}
                  touched={touched.password}
                  disabled={isSubmitting}
                  className="bg-blue-50 sm:col-span-2"
                />
              </div>

              {/* Profile Image input - full width */}
              <div className="mt-8 mb-6">
                <label
                  htmlFor="profileImage"
                  className="block text-sm font-semibold text-blue-700 mb-2"
                >
                  Profile Image
                </label>
                <input
                  id="profileImage"
                  name="profileImage"
                  type="file"
                  accept="image/*"
                  onChange={(event) => {
                    setFieldValue("profileImage", event.currentTarget.files[0]);
                  }}
                  disabled={isSubmitting}
                  className="block w-full text-sm text-blue-900
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-full file:border-0
                    file:text-sm file:font-semibold
                    file:bg-blue-100 file:text-blue-700
                    hover:file:bg-blue-200
                    cursor-pointer
                    disabled:cursor-not-allowed disabled:opacity-50
                  "
                />
                {errors.profileImage && touched.profileImage && (
                  <p className="text-sm text-red-600 mt-1">
                    {errors.profileImage}
                  </p>
                )}
              </div>

              <Button
                type="submit"
                size="lg"
                loading={isSubmitting || loading}
                className="w-full rounded-xl bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500 focus:ring-2 focus:ring-offset-2"
              >
                {isSubmitting || loading ? "Registering..." : "Register"}
              </Button>
            </Form>
          )}
        </Formik>
        <div className="text-sm text-center text-gray-600 mt-6">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-blue-600 hover:underline font-semibold"
          >
            Login here
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RegisterForm;
