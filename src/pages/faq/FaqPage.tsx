import { useState } from "react";
import { Button, Table, Input, Modal, Form, App as AntApp, Space, Popconfirm } from "antd";
import { PlusOutlined, SearchOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import PageHeader from "@/components/common/PageHeader";
import {
  useGetFaqsQuery,
  useCreateFaqMutation,
  useUpdateFaqMutation,
  useDeleteFaqMutation,
} from "@/features/faq/faqApi";
import type { Faq, FaqPayload } from "@/types";

export default function FaqPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const { data, isFetching } = useGetFaqsQuery({ searchTerm: searchTerm || undefined });
  const [createFaq, { isLoading: creating }] = useCreateFaqMutation();
  const [updateFaq, { isLoading: updating }] = useUpdateFaqMutation();
  const [deleteFaq] = useDeleteFaqMutation();
  const { message } = AntApp.useApp();

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Faq | null>(null);
  const [form] = Form.useForm<FaqPayload>();

  const openCreate = () => {
    setEditing(null);
    form.resetFields();
    setModalOpen(true);
  };

  const openEdit = (record: Faq) => {
    setEditing(record);
    form.setFieldsValue({ question: record.question, answer: record.answer });
    setModalOpen(true);
  };

  const onSubmit = async (values: FaqPayload) => {
    try {
      if (editing) {
        await updateFaq({ id: editing._id, body: values }).unwrap();
        message.success("FAQ updated");
      } else {
        await createFaq(values).unwrap();
        message.success("FAQ created");
      }
      setModalOpen(false);
    } catch (err) {
      const description =
        (err as { data?: { message?: string } })?.data?.message ?? "Something went wrong";
      message.error(description);
    }
  };

  const onDelete = async (id: string) => {
    try {
      await deleteFaq(id).unwrap();
      message.success("FAQ deleted");
    } catch {
      message.error("Could not delete FAQ");
    }
  };

  const columns: ColumnsType<Faq> = [
    { title: "Question", dataIndex: "question", key: "question" },
    {
      title: "Answer",
      dataIndex: "answer",
      key: "answer",
      ellipsis: true,
      render: (v: string) => <span className="text-slate-500">{v}</span>,
    },
    {
      title: "Actions",
      key: "actions",
      width: 140,
      render: (_, record) => (
        <Space>
          <Button size="small" icon={<EditOutlined />} onClick={() => openEdit(record)} />
          <Popconfirm
            title="Delete this FAQ?"
            description="This can't be undone."
            onConfirm={() => onDelete(record._id)}
            okText="Delete"
            okButtonProps={{ danger: true }}
          >
            <Button size="small" danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        title="FAQ"
        subtitle="Manage frequently asked questions shown to visitors."
        extra={
          <>
            <Input
              placeholder="Search FAQs"
              prefix={<SearchOutlined className="text-slate-400" />}
              onChange={(e) => setSearchTerm(e.target.value)}
              allowClear
              className="!w-56"
            />
            <Button type="primary" icon={<PlusOutlined />} onClick={openCreate}>
              Add FAQ
            </Button>
          </>
        }
      />

      <Table
        rowKey="_id"
        loading={isFetching}
        dataSource={data?.data ?? []}
        columns={columns}
        pagination={{ pageSize: 10, showSizeChanger: false }}
        className="overflow-hidden rounded-xl bg-white shadow-sm"
      />

      <Modal
        title={editing ? "Edit FAQ" : "Add FAQ"}
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        onOk={() => form.submit()}
        confirmLoading={creating || updating}
        okText={editing ? "Save changes" : "Create"}
        destroyOnHidden
      >
        <Form form={form} layout="vertical" onFinish={onSubmit} className="mt-4">
          <Form.Item
            label="Question"
            name="question"
            rules={[{ required: true, message: "Please enter a question" }]}
          >
            <Input placeholder="e.g. How is pricing calculated?" size="large" />
          </Form.Item>
          <Form.Item
            label="Answer"
            name="answer"
            rules={[{ required: true, message: "Please enter an answer" }]}
          >
            <Input.TextArea rows={4} placeholder="Write the answer here" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
