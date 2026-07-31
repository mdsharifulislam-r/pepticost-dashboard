import { useEffect, useState } from "react";
import {
  Modal,
  Form,
  Input,
  Select,
  Upload,
  App as AntApp,
} from "antd";
import { PlusOutlined } from "@ant-design/icons";
import type { UploadFile } from "antd";
import { useCreateBlogMutation, useUpdateBlogMutation } from "@/features/blog/blogApi";
import type { Blog, BlogCategory } from "@/types";

const { TextArea } = Input;

interface BlogFormModalProps {
  open: boolean;
  onClose: () => void;
  editing: Blog | null;
}

const categories: BlogCategory[] = [
  "Peptide Pricing",
  "Research",
  "Guides",
  "Vendor Reviews",
  "News",
];

interface BlogFormValues {
  headline: string;
  content: string;
  category: BlogCategory;
  tags: string[];
}

export default function BlogFormModal({ open, onClose, editing }: BlogFormModalProps) {
  const [form] = Form.useForm<BlogFormValues>();
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [createBlog, { isLoading: creating }] = useCreateBlogMutation();
  const [updateBlog, { isLoading: updating }] = useUpdateBlogMutation();
  const { message } = AntApp.useApp();

  useEffect(() => {
    if (!open) return;
    if (editing) {
      form.setFieldsValue({
        headline: editing.headline,
        content: editing.content,
        category: editing.category,
        tags: editing.tags,
      });
      setFileList(
        editing.image
          ? [{ uid: "-1", name: "current-image", status: "done", url: editing.image }]
          : []
      );
    } else {
      form.resetFields();
      setFileList([]);
    }
  }, [open, editing, form]);

  const onSubmit = async (values: BlogFormValues) => {
    const formData = new FormData();
    formData.append("headline", values.headline);
    formData.append("content", values.content);
    formData.append("category", values.category);
    (values.tags ?? []).forEach((tag) => formData.append("tags[]", tag));

    const newFile = fileList.find((f) => f.originFileObj)?.originFileObj;
    if (newFile) {
      formData.append("image", newFile);
    }

    try {
      if (editing) {
        await updateBlog({ id: editing._id, formData }).unwrap();
        message.success("Blog post updated");
      } else {
        await createBlog(formData).unwrap();
        message.success("Blog post created");
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
      title={editing ? "Edit blog post" : "Add blog post"}
      open={open}
      onCancel={onClose}
      onOk={() => form.submit()}
      confirmLoading={creating || updating}
      okText={editing ? "Save changes" : "Publish"}
      width={680}
      destroyOnHidden
    >
      <Form form={form} layout="vertical" onFinish={onSubmit} className="mt-4">
        <Form.Item
          label="Headline"
          name="headline"
          rules={[{ required: true, message: "Please enter a headline" }]}
        >
          <Input placeholder="e.g. How tirzepatide works at the molecular level" />
        </Form.Item>

        <Form.Item
          label="Category"
          name="category"
          rules={[{ required: true, message: "Please select a category" }]}
        >
          <Select
            placeholder="Select a category"
            options={categories.map((c) => ({ value: c, label: c }))}
          />
        </Form.Item>

        <Form.Item label="Tags" name="tags">
          <Select mode="tags" placeholder="Add tags and press enter" tokenSeparators={[","]} />
        </Form.Item>

        <Form.Item
          label="Content"
          name="content"
          rules={[{ required: true, message: "Please write the post content" }]}
        >
          <TextArea rows={6} placeholder="Write the full post content" />
        </Form.Item>

        <Form.Item label="Cover image">
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
