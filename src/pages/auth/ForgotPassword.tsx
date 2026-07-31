import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button, Form, Input, Typography, App as AntApp } from "antd";
import { MailOutlined, ArrowLeftOutlined } from "@ant-design/icons";
import { useForgotPasswordMutation } from "@/features/auth/authApi";
import type { ForgotPasswordPayload } from "@/types";

const { Title, Text } = Typography;

export default function ForgotPassword() {
  const [forgotPassword, { isLoading }] = useForgotPasswordMutation();
  const { message } = AntApp.useApp();
  const navigate = useNavigate();
  const [sent, setSent] = useState(false);

  const onFinish = async (values: ForgotPasswordPayload) => {
    try {
      await forgotPassword(values).unwrap();
      setSent(true);
      message.success("Reset instructions sent, check the inbox.");
    } catch (err) {
      const description =
        (err as { data?: { message?: string } })?.data?.message ??
        "Could not send reset instructions.";
      message.error(description);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <Title level={3} className="!mb-1">
            Forgot password
          </Title>
          <Text type="secondary">
            Enter the account email and we'll send a one-time code to reset it.
          </Text>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
          {sent ? (
            <div className="space-y-4 text-center">
              <Text>
                If an account exists for that email, a reset code is on its way.
              </Text>
              <Button type="primary" block onClick={() => navigate("/reset-password")}>
                I have a code — reset password
              </Button>
            </div>
          ) : (
            <Form layout="vertical" onFinish={onFinish} requiredMark={false}>
              <Form.Item
                label="Email"
                name="email"
                rules={[
                  { required: true, message: "Please enter your email" },
                  { type: "email", message: "Enter a valid email address" },
                ]}
              >
                <Input
                  prefix={<MailOutlined className="text-slate-400" />}
                  placeholder="you@pepticost.com"
                  size="large"
                />
              </Form.Item>

              <Button type="primary" htmlType="submit" size="large" block loading={isLoading}>
                Send reset code
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
