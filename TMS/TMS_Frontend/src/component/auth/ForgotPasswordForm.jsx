import React, { useEffect } from "react";
import { Formik, Form } from "formik";
import { Link } from "react-router-dom";
import Input from "../common/input";
import Button from "../common/Button";
import { useToast } from "../common/ToastContext";
import * as Yup from "yup";
import useAuthStore from "../../store/authStore";

const forgotPasswordSchema = Yup.object({
  email: Yup.string()
    .email("Invalid email format")
    .required("Email is required"),
});

const ForgotPasswordForm = () => {
  const { showToast } = useToast();
  const forgotPassword = useAuthStore((state) => state.forgotPassword);
  const loading = useAuthStore((state) => state.loading);
  const error = useAuthStore((state) => state.error);
  const success = useAuthStore((state) => state.success);

  useEffect(() => {
    if (success) {
      showToast("Password reset link sent to your email!", "success");
    }
    if (error) {
      showToast(error, "error");
    }
  }, [success, error, showToast]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-blue-50 px-4">
      <div className="w-full max-w-lg bg-white rounded-3xl shadow-lg p-10 sm:p-12">
        <h2 className="text-4xl font-extrabold mb-8 text-center text-blue-700 drop-shadow-sm">
          Forgot Password
        </h2>

        <Formik
          initialValues={{ email: "" }}
          validationSchema={forgotPasswordSchema}
          onSubmit={async (values, actions) => {
            try {
              await forgotPassword(values);
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

                <Button
                  type="submit"
                  size="lg"
                  loading={loading || isSubmitting}
                  className="w-full rounded-xl bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500 focus:ring-2 focus:ring-offset-2"
                >
                  {(loading || isSubmitting) ? "Sending..." : "Send Reset Link"}
                </Button>
              </div>
            </Form>
          )}
        </Formik>

        <div className="text-sm text-center text-gray-600 mt-6">
          Remember your password?{" "}
          <Link to="/login" className="text-blue-600 hover:underline font-semibold">
            Login here
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordForm;
