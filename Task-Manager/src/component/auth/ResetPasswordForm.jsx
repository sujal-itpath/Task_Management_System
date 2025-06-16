import React, { useEffect } from "react";
import { Formik, Form } from "formik";
import { Link } from "react-router-dom";
import Input from "../common/input";
import Button from "../common/Button";
import { useToast } from "../common/ToastContext";
import * as Yup from "yup";
import useAuthStore from "../../store/authStore";

const resetPasswordSchema = Yup.object({
  newPassword: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("New password is required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("newPassword")], "Passwords must match")
    .required("Confirm password is required"),
});

const ResetPasswordForm = () => {
  const { showToast } = useToast();
  const resetPassword = useAuthStore((state) => state.resetPassword);
  const loading = useAuthStore((state) => state.loading);
  const error = useAuthStore((state) => state.error);
  const success = useAuthStore((state) => state.success);

  useEffect(() => {
    if (success) {
      showToast("Password has been reset successfully!", "success");
    }
    if (error) {
      showToast(error, "error");
    }
  }, [success, error, showToast]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-blue-50 px-4">
      <div className="w-full max-w-lg bg-white rounded-3xl shadow-lg p-10 sm:p-12">
        <h2 className="text-4xl font-extrabold mb-8 text-center text-blue-700 drop-shadow-sm">
          Reset Password
        </h2>

        <Formik
          initialValues={{ newPassword: "", confirmPassword: "" }}
          validationSchema={resetPasswordSchema}
          onSubmit={async (values, actions) => {
            try {
              await resetPassword(values);
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
                  label="New Password"
                  name="newPassword"
                  type="password"
                  placeholder="********"
                  value={values.newPassword}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={errors.newPassword}
                  touched={touched.newPassword}
                  disabled={loading || isSubmitting}
                  className="bg-blue-50"
                />
                <Input
                  label="Confirm Password"
                  name="confirmPassword"
                  type="password"
                  placeholder="********"
                  value={values.confirmPassword}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={errors.confirmPassword}
                  touched={touched.confirmPassword}
                  disabled={loading || isSubmitting}
                  className="bg-blue-50"
                />

                <Button
                  type="submit"
                  size="lg"
                  loading={loading || isSubmitting}
                  className="w-full rounded-xl bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500 focus:ring-2 focus:ring-offset-2"
                >
                  {(loading || isSubmitting) ? "Resetting..." : "Reset Password"}
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

export default ResetPasswordForm;
