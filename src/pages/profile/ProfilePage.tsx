import { useEffect, useState } from "react";
import {
  Tabs,
  Form,
  Input,
  Button,
  Avatar,
  Upload,
  App as AntApp,
} from "antd";
import { UserOutlined, SaveOutlined, LockOutlined, CameraOutlined } from "@ant-design/icons";
import type { UploadFile } from "antd";
import PageHeader from "@/components/common/PageHeader";
import { useAppDispatch } from "@/app/hooks";
import {
  useGetProfileQuery,
  useUpdateProfileMutation,
  useChangePasswordMutation,
} from "@/features/auth/authApi";
import { updateUserInfo } from "@/features/auth/authSlice";
import type { ChangePasswordPayload } from "@/types";


function ProfileDetailsForm() {
  const { data, isFetching } = useGetProfileQuery();
  const [updateProfile, { isLoading: saving }] = useUpdateProfileMutation();
  const dispatch = useAppDispatch();
  const { message } = AntApp.useApp();
  const [form] = Form.useForm<{ name: string; contact?: string }>();
  const [fileList, setFileList] = useState<UploadFile[]>([]);

  useEffect(() => {
    if (data?.data) {
      form.setFieldsValue({ name: data.data.name, contact: data.data.contact });
    }
  }, [data, form]);

  const onFinish = async (values: { name: string; contact?: string }) => {
    const formData = new FormData();
    formData.append("name", values.name);
    if (values.contact) formData.append("contact", values.contact);
    const newFile = fileList.find((f) => f.originFileObj)?.originFileObj;
    if (newFile) formData.append("image", newFile);

    try {
      const res = await updateProfile(formData).unwrap();
      message.success("Profile updated");
      dispatch(updateUserInfo({ name: res.data.name }));
      setFileList([]);
    } catch (err) {
      const description =
        (err as { data?: { message?: string } })?.data?.message ?? "Could not update profile";
      message.error(description);
    }
  };

  return (
    <div className="rounded-xl bg-white p-6 shadow-sm">
      <div className="mb-6 flex items-center gap-4">
        <Avatar
          size={72}
          src={fileList[0]?.thumbUrl ?? data?.data?.image}
          icon={<UserOutlined />}
        />
        <Upload
          showUploadList={false}
          beforeUpload={(file) => {
            const reader = new FileReader();
            reader.onload = () => {
              setFileList([
                {
                  uid: file.uid,
                  name: file.name,
                  status: "done",
                  originFileObj: file,
                  thumbUrl: reader.result as string,
                },
              ]);
            };
            reader.readAsDataURL(file);
            return false;
          }}
        >
          <Button icon={<CameraOutlined />}>Change photo</Button>
        </Upload>
      </div>

      <Form form={form} layout="vertical" onFinish={onFinish} disabled={isFetching}>
        <Form.Item
          label="Full name"
          name="name"
          rules={[{ required: true, message: "Please enter your name" }]}
        >
          <Input size="large" />
        </Form.Item>
        <Form.Item label="Contact number" name="contact">
          <Input size="large" />
        </Form.Item>
        <Form.Item label="Email">
          <Input size="large" value={data?.data?.email} disabled />
        </Form.Item>
        <Button type="primary" htmlType="submit" icon={<SaveOutlined />} loading={saving}>
          Save changes
        </Button>
      </Form>
    </div>
  );
}

function ChangePasswordForm() {
  const [changePassword, { isLoading }] = useChangePasswordMutation();
  const { message } = AntApp.useApp();
  const [form] = Form.useForm<ChangePasswordPayload>();

  const onFinish = async (values: ChangePasswordPayload) => {
    try {
      await changePassword(values).unwrap();
      message.success("Password changed successfully");
      form.resetFields();
    } catch (err) {
      const description =
        (err as { data?: { message?: string } })?.data?.message ?? "Could not change password";
      message.error(description);
    }
  };

  return (
    <div className="max-w-md rounded-xl bg-white p-6 shadow-sm">
      <Form form={form} layout="vertical" onFinish={onFinish} requiredMark={false}>
        <Form.Item
          label="Current password"
          name="currentPassword"
          rules={[{ required: true, message: "Please enter your current password" }]}
        >
          <Input.Password prefix={<LockOutlined className="text-slate-400" />} size="large" />
        </Form.Item>
        <Form.Item
          label="New password"
          name="newPassword"
          rules={[{ required: true, message: "Please enter a new password" }]}
        >
          <Input.Password prefix={<LockOutlined className="text-slate-400" />} size="large" />
        </Form.Item>
        <Form.Item
          label="Confirm new password"
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
          <Input.Password prefix={<LockOutlined className="text-slate-400" />} size="large" />
        </Form.Item>
        <Button type="primary" htmlType="submit" loading={isLoading}>
          Update password
        </Button>
      </Form>
    </div>
  );
}

export default function ProfilePage() {
  return (
    <div>
      <PageHeader title="My profile" subtitle="Manage your admin account details and security." />
      <Tabs
        defaultActiveKey="details"
        items={[
          { key: "details", label: "Profile details", children: <ProfileDetailsForm /> },
          { key: "password", label: "Change password", children: <ChangePasswordForm /> },
        ]}
      />
    </div>
  );
}
