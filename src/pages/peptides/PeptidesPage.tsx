import { useState } from "react";
import { Button, Table, Input, Modal, Form, App as AntApp, Space, Popconfirm } from "antd";
import { PlusOutlined, SearchOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import PageHeader from "@/components/common/PageHeader";
import {
  useGetPeptidesQuery,
  useCreatePeptideMutation,
  useUpdatePeptideMutation,
  useDeletePeptideMutation,
} from "@/features/peptides/peptidesApi";
import type { Peptide, PeptidePayload } from "@/types";

export default function PeptidesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState<number>(1);
  const { data, isFetching } = useGetPeptidesQuery({ searchTerm: searchTerm || undefined, page });
  const [createPeptide, { isLoading: creating }] = useCreatePeptideMutation();
  const [updatePeptide, { isLoading: updating }] = useUpdatePeptideMutation();
  const [deletePeptide] = useDeletePeptideMutation();
  const { message } = AntApp.useApp();

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Peptide | null>(null);
  const [form] = Form.useForm<PeptidePayload>();

  const openCreate = () => {
    setEditing(null);
    form.resetFields();
    setModalOpen(true);
  };

  const openEdit = (record: Peptide) => {
    setEditing(record);
    form.setFieldsValue({ name: record.name });
    setModalOpen(true);
  };

  const onSubmit = async (values: PeptidePayload) => {
    try {
      if (editing) {
        await updatePeptide({ id: editing._id, body: values }).unwrap();
        message.success("Peptide updated");
      } else {
        await createPeptide(values).unwrap();
        message.success("Peptide created");
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
      await deletePeptide(id).unwrap();
      message.success("Peptide deleted");
    } catch {
      message.error("Could not delete peptide");
    }
  };

  const columns: ColumnsType<Peptide> = [
    { title: "Name", dataIndex: "name", key: "name" },
    {
      title: "Created",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (v?: string) => (v ? new Date(v).toLocaleDateString() : "—"),
    },
    {
      title: "Actions",
      key: "actions",
      width: 140,
      render: (_, record) => (
        <Space>
          <Button size="small" icon={<EditOutlined />} onClick={() => openEdit(record)} />
          <Popconfirm
            title="Delete this peptide?"
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
        title="Peptides"
        subtitle="Manage the peptide catalog used across vendor listings."
        extra={
          <>
            <Input
              placeholder="Search peptides"
              prefix={<SearchOutlined className="text-slate-400" />}
              onChange={(e) => setSearchTerm(e.target.value)}
              allowClear
              className="w-56!"
            />
            <Button type="primary" icon={<PlusOutlined />} onClick={openCreate}>
              Add peptide
            </Button>
          </>
        }
      />

      <Table
        rowKey="_id"
        loading={isFetching}
        dataSource={data?.data ?? []}
        columns={columns}
        pagination={{
          pageSize: data?.pagination?.limit,
          total: data?.pagination?.total,
          current: data?.pagination?.page,
          onChange: (p) => setPage(p),
        }}
        className="overflow-hidden rounded-xl bg-white shadow-sm"
      />

      <Modal
        title={editing ? "Edit peptide" : "Add peptide"}
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        onOk={() => form.submit()}
        confirmLoading={creating || updating}
        okText={editing ? "Save changes" : "Create"}
        destroyOnHidden
      >
        <Form form={form} layout="vertical" onFinish={onSubmit} className="mt-4">
          <Form.Item
            label="Peptide name"
            name="name"
            rules={[{ required: true, message: "Please enter a peptide name" }]}
          >
            <Input placeholder="e.g. Retatrutide" size="large" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
