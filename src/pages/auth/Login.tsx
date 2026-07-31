import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button, Form, Input, Typography, App as AntApp } from "antd";
import { LockOutlined, MailOutlined } from "@ant-design/icons";
import { useAppDispatch } from "@/app/hooks";
import { useLoginMutation } from "@/features/auth/authApi";
import { setCredentials } from "@/features/auth/authSlice";
import type { LoginPayload } from "@/types";

const { Title, Text } = Typography;

export default function Login() {
  const [login, { isLoading }] = useLoginMutation();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { message } = AntApp.useApp();
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const onFinish = async (values: LoginPayload) => {
    setErrorMsg(null);
    try {
      const res = await login(values).unwrap();
      const { accessToken, role, name, email } = res.data;

      if (role !== "ADMIN" && role !== "SUPER_ADMIN") {
        setErrorMsg("This account does not have admin access.");
        return;
      }

      dispatch(setCredentials({ token: accessToken, role, name, email }));
      message.success("Welcome back!");
      navigate("/", { replace: true });
    } catch (err) {
      const description =
        (err as { data?: { message?: string } })?.data?.message ??
        "Invalid email or password.";
      setErrorMsg(description);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-teal-600 text-lg font-bold text-white">
            PC
          </div>
          <Title level={3} className="!mb-1">
            Pepticost Admin
          </Title>
          <Text type="secondary">Sign in to manage your catalog and content</Text>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
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
                autoComplete="email"
              />
            </Form.Item>

            <Form.Item
              label="Password"
              name="password"
              rules={[{ required: true, message: "Please enter your password" }]}
            >
              <Input.Password
                prefix={<LockOutlined className="text-slate-400" />}
                placeholder="••••••••"
                size="large"
                autoComplete="current-password"
              />
            </Form.Item>

            {errorMsg && (
              <Text type="danger" className="mb-3 block">
                {errorMsg}
              </Text>
            )}

            <div className="mb-4 flex justify-end">
              <Link to="/forgot-password" className="text-sm text-teal-700 hover:underline">
                Forgot password?
              </Link>
            </div>

            <Button
              type="primary"
              htmlType="submit"
              size="large"
              block
              loading={isLoading}
            >
              Sign in
            </Button>
          </Form>
        </div>
      </div>
    </div>
  );
}
