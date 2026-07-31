import { useEffect, useState } from "react";
import { Modal, Form, Input, Select, Upload, App as AntApp } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import type { UploadFile } from "antd";
import { useCreateBannerMutation, useUpdateBannerMutation } from "@/features/banner/bannerApi";
import type { Banner, BannerStatus } from "@/types";

interface BannerFormModalProps {
  open: boolean;
  onClose: () => void;
  editing: Banner | null;
}

interface BannerFormValues {
  title: string;
  link: string;
  status: BannerStatus;
}

export default function BannerFormModal({ open, onClose, editing }: BannerFormModalProps) {
  const [form] = Form.useForm<BannerFormValues>();
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [createBanner, { isLoading: creating }] = useCreateBannerMutation();
  const [updateBanner, { isLoading: updating }] = useUpdateBannerMutation();
  const { message } = AntApp.useApp();

  useEffect(() => {
    if (!open) return;
    if (editing) {
      form.setFieldsValue({
        title: editing.title,
        link: editing.link,
        status: editing.status,
      });
      setFileList(
        editing.image
          ? [{ uid: "-1", name: "banner-image", status: "done", url: editing.image }]
          : []
      );
    } else {
      form.resetFields();
      setFileList([]);
    }
  }, [open, editing, form]);

  const onSubmit = async (values: BannerFormValues) => {
    if (!fileList.length && !editing) {
      message.error("Please upload a banner image");
      return;
    }

    const formData = new FormData();
    formData.append("title", values.title);
    formData.append("link", values.link);
    formData.append("status", values.status);

    const newFile = fileList.find((f) => f.originFileObj)?.originFileObj;
    if (newFile) {
      formData.append("image", newFile);
    }

    try {
      if (editing) {
        await updateBanner({ id: editing._id, formData }).unwrap();
        message.success("Banner updated successfully");
      } else {
        await createBanner(formData).unwrap();
        message.success("Banner created successfully");
      }
      onClose();
    } catch (err) {
      const description =
        (err as { data?: { message?: string } })?.data?.message ?? "Something went wrong";
      message.error(description);
    }
  };

  return (
    <Modal
      title={editing ? "Edit banner" : "Add banner"}
      open={open}
      onCancel={onClose}
      onOk={() => form.submit()}
      confirmLoading={creating || updating}
      okText={editing ? "Save changes" : "Create"}
      width={680}
      destroyOnHidden
    >
      <Form form={form} layout="vertical" onFinish={onSubmit} className="mt-4">
        <Form.Item
          label="Banner Title"
          name="title"
          rules={[{ required: true, message: "Please enter a banner title" }]}
        >
          <Input placeholder="e.g. Summer Sale" />
        </Form.Item>

        <Form.Item
          label="Link"
          name="link"
          rules={[
            { required: true, message: "Please enter a link" },
            { type: "url", message: "Please enter a valid URL" },
          ]}
        >
          <Input placeholder="e.g. https://example.com" />
        </Form.Item>

        <Form.Item
          label="Status"
          name="status"
          initialValue="active"
          rules={[{ required: true, message: "Please select a status" }]}
        >
          <Select
            options={[
              { value: "active", label: "Active" },
              { value: "inactive", label: "Inactive" },
            ]}
          />
        </Form.Item>

        <Form.Item label="Banner Image">
          <Upload
            listType="picture-card"
            fileList={fileList}
            beforeUpload={(file) => {
              setFileList([
                { uid: file.uid, name: file.name, status: "done", originFileObj: file },
              ]);
              return false;
            }}
            onRemove={() => setFileList([])}
            maxCount={1}
            showUploadList={{ showPreviewIcon: false }}
          >
            {fileList.length === 0 && (
              <div className="flex flex-col items-center justify-center">
                <PlusOutlined />
                <div className="mt-2 text-xs">Upload</div>
              </div>
            )}
          </Upload>
        </Form.Item>
      </Form>
    </Modal>
  );
}
