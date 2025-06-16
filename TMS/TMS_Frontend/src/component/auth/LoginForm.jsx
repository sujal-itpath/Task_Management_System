import React, { useEffect } from "react";
import { Formik, Form } from "formik";
import { Link, useNavigate } from "react-router-dom";
import Input from "../common/input";
import Button from "../common/Button";
import { useToast } from "../common/ToastContext";
import { loginValidationSchema } from "../../validation/authValidation";
import useAuthStore from "../../store/authStore";

const LoginForm = () => {
  const { showToast } = useToast();
  const navigate = useNavigate();

  const login = useAuthStore((state) => state.login);
  const loading = useAuthStore((state) => state.loading);
  const error = useAuthStore((state) => state.error);
  const success = useAuthStore((state) => state.success);
  const clearError = useAuthStore((state) => state.clearError);
  const clearSuccess = useAuthStore((state) => state.clearSuccess);

  useEffect(() => {
    if (success) {
      showToast("Logged in successfully!", "success");
      clearSuccess();
      navigate("/");
    }
    if (error) {
      showToast(error, "error");
      clearError();
    }
  }, [success, error, showToast, navigate, clearSuccess, clearError]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-blue-50 px-4">
      <div className="w-full max-w-lg bg-white rounded-3xl shadow-lg p-10 sm:p-12">
        <h2 className="text-4xl font-extrabold mb-8 text-center text-blue-700 drop-shadow-sm">
          Welcome Back
        </h2>

        <Formik
          initialValues={{
            email: "",
            password: "",
          }}
          validationSchema={loginValidationSchema}
          onSubmit={async (values, actions) => {
            try {
              await login(values);
              actions.resetForm();
            } catch {
              // error is handled by store + toast
            } finally {
              actions.setSubmitting(false);
            }
          }}
        >
          {({
            values,
            errors,
            touched,
            isSubmitting,
            handleChange,
            handleBlur,
          }) => (
            <Form noValidate>
              <div className="space-y-6">
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
                  disabled={loading || isSubmitting}
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
                  disabled={loading || isSubmitting}
                  className="bg-blue-50"
                />

                <Button
                  type="submit"
                  size="lg"
                  loading={loading || isSubmitting}
                  className="w-full rounded-xl bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500 focus:ring-2 focus:ring-offset-2"
                >
                  {(loading || isSubmitting) ? "Logging in..." : "Login"}
                </Button>

                <div className="text-sm text-center">
                  <Link
                    to="/forgot-password"
                    className="text-blue-600 hover:underline font-semibold"
                  >
                    Forgot your password?
                  </Link>
                </div>
              </div>
            </Form>
          )}
        </Formik>

        <div className="text-sm text-center text-gray-600 mt-6">
          Don't have an account?{" "}
          <Link
            to="/register"
            className="text-blue-600 hover:underline font-semibold"
          >
            Register here
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
