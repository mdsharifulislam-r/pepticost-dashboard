import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button, Form, Input, InputNumber, Typography, App as AntApp, Steps } from "antd";
import { MailOutlined, LockOutlined, ArrowLeftOutlined } from "@ant-design/icons";
import { useVerifyOtpMutation, useResetPasswordMutation } from "@/features/auth/authApi";
import type { VerifyOtpPayload } from "@/types";

const { Title, Text } = Typography;

export default function ResetPassword() {
  const [verifyOtp, { isLoading: verifying }] = useVerifyOtpMutation();
  const [resetPassword, { isLoading: resetting }] = useResetPasswordMutation();
  const { message } = AntApp.useApp();
  const navigate = useNavigate();

  const [step, setStep] = useState(0);
  const [resetToken, setResetToken] = useState<string | null>(null);

  const onVerify = async (values: VerifyOtpPayload) => {
    try {
      const res = await verifyOtp(values).unwrap();
      setResetToken(res.data.accessToken);
      setStep(1);
    } catch (err) {
      const description =
        (err as { data?: { message?: string } })?.data?.message ??
        "Invalid or expired code.";
      message.error(description);
    }
  };

  const onReset = async (values: { newPassword: string; confirmPassword: string }) => {
    if (!resetToken) return;
    try {
      await resetPassword({ ...values, resetToken }).unwrap();
      message.success("Password updated. Please sign in.");
      navigate("/login", { replace: true });
    } catch (err) {
      const description =
        (err as { data?: { message?: string } })?.data?.message ??
        "Could not reset password.";
      message.error(description);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <Title level={3} className="!mb-1">
            Reset password
          </Title>
          <Text type="secondary">
            Enter the code that was emailed to you, then choose a new password.
          </Text>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
          <Steps
            current={step}
            size="small"
            className="mb-6"
            items={[{ title: "Verify code" }, { title: "New password" }]}
          />

          {step === 0 ? (
            <Form layout="vertical" onFinish={onVerify} requiredMark={false}>
              <Form.Item
                label="Email"
                name="email"
                rules={[{ required: true, message: "Please enter your email" }]}
              >
                <Input prefix={<MailOutlined className="text-slate-400" />} size="large" />
              </Form.Item>
              <Form.Item
                label="One-time code"
                name="oneTimeCode"
                rules={[{ required: true, message: "Please enter the code" }]}
              >
                <InputNumber size="large" className="w-full!" placeholder="123456" />
              </Form.Item>
              <Button type="primary" htmlType="submit" size="large" block loading={verifying}>
                Verify code
              </Button>
            </Form>
          ) : (
            <Form layout="vertical" onFinish={onReset} requiredMark={false}>
              <Form.Item
                label="New password"
                name="newPassword"
                rules={[{ required: true, message: "Please enter a new password" }]}
              >
                <Input.Password
                  prefix={<LockOutlined className="text-slate-400" />}
                  size="large"
                />
              </Form.Item>
              <Form.Item
                label="Confirm password"
                name="confirmPassword"
                dependencies={["newPassword"]}
                rules={[
                  { required: true, message: "Please confirm the new password" },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue("newPassword") === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject(new Error("Passwords do not match"));
                    },
                  }),
                ]}
              >
                <Input.Password
                  prefix={<LockOutlined className="text-slate-400" />}
                  size="large"
                />
              </Form.Item>
              <Button type="primary" htmlType="submit" size="large" block loading={resetting}>
                Reset password
              </Button>
            </Form>
          )}

          <div className="mt-6 text-center">
            <Link to="/login" className="text-sm text-teal-700 hover:underline">
              <ArrowLeftOutlined className="mr-1" />
              Back to sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
