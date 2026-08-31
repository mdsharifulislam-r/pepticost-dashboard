import { useState } from "react";
import { Button, Table, Input, App as AntApp, Space, Popconfirm, Tag, Typography } from "antd";
import {
  SearchOutlined,
  DeleteOutlined,
  MessageOutlined,
} from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import PageHeader from "@/components/common/PageHeader";
import {
  useGetSupportMessagesQuery,
  useDeleteSupportMessageMutation,
} from "@/features/support/supportApi";
import type { Support, SupportStatus } from "@/types";
import SupportReplyModal from "@/pages/support/SupportReplyModal";

const { Text } = Typography;

const statusColors: Record<SupportStatus, string> = {
  pending: "orange",
  replied: "blue",
  resolved: "green",
};

export default function SupportPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState<number>(1);
  const { data, isFetching } = useGetSupportMessagesQuery({
    searchTerm: searchTerm || undefined,
    page,
  });
  const [deleteSupportMessage] = useDeleteSupportMessageMutation();
  const { message } = AntApp.useApp();

  const [modalOpen, setModalOpen] = useState(false);
  const [selected, setSelected] = useState<Support | null>(null);

  const openReply = (record: Support) => {
    setSelected(record);
    setModalOpen(true);
  };

  const onDelete = async (id: string) => {
    try {
      await deleteSupportMessage(id).unwrap();
      message.success("Support message deleted");
    } catch {
      message.error("Could not delete this message");
    }
  };

  const columns: ColumnsType<Support> = [
    {
      title: "From",
      key: "from",
      render: (_, record) => (
        <div>
          <div className="font-medium text-slate-800">{record.name}</div>
          <Text type="secondary" className="text-xs">
            {record.email}
          </Text>
        </div>
      ),
    },
    {
      title: "Contact",
      dataIndex: "contact",
      key: "contact",
      render: (contact: string) => contact || "—",
    },
    {
      title: "Message",
      dataIndex: "message",
      key: "message",
      ellipsis: true,
      width: 220,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: SupportStatus) => (
        <Tag color={statusColors[status]}>{status}</Tag>
      ),
    },
    {
      title: "Reply",
      dataIndex: "reply",
      key: "reply",
      ellipsis: true,
      width: 180,
      render: (reply?: string) => reply || "—",
    },
    {
      title: "Received",
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
          <Button
            size="small"
            icon={<MessageOutlined />}
            onClick={() => openReply(record)}
          />
          <Popconfirm
            title="Delete this message?"
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
        title="Support"
        subtitle="View and respond to customer support messages."
        extra={
          <Input
            placeholder="Search messages"
            prefix={<SearchOutlined className="text-slate-400" />}
            onChange={(e) => setSearchTerm(e.target.value)}
            allowClear
            className="w-56!"
          />
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

      <SupportReplyModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        support={selected}
      />
    </div>
  );
}
