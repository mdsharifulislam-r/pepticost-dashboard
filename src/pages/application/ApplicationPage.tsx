import { useState } from "react";
import {
  Button,
  Table,
  Input,
  Select,
  App as AntApp,
  Space,
  Tag,
  Typography,
  Popconfirm,
} from "antd";
import { SearchOutlined, EyeOutlined } from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import PageHeader from "@/components/common/PageHeader";
import {
  useGetApplicationsQuery,
  useUpdateApplicationStatusMutation,
} from "@/features/application/applicationApi";
import type { Application, ApplicationStatus, ApplicationStatusPayload } from "@/types";
import ApplicationDetailModal from "@/pages/application/ApplicationDetailModal";

const { Text } = Typography;

const statusColors: Record<ApplicationStatus, string> = {
  pending: "orange",
  reviewed: "blue",
  resolved: "green",
  delete: "red",
};

const statusOptions: { value: ApplicationStatusPayload["status"]; label: string }[] = [
  { value: "reviewed", label: "Reviewed" },
  { value: "resolved", label: "Resolved" },
  { value: "delete", label: "Delete" },
];

export default function ApplicationPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<ApplicationStatus | undefined>();
  const { data, isFetching } = useGetApplicationsQuery({
    searchTerm: searchTerm || undefined,
    status: statusFilter,
  });
  const [updateStatus] = useUpdateApplicationStatusMutation();
  const { message } = AntApp.useApp();

  const [modalOpen, setModalOpen] = useState(false);
  const [selected, setSelected] = useState<Application | null>(null);

  const openDetail = (record: Application) => {
    setSelected(record);
    setModalOpen(true);
  };

  const onStatusChange = async (
    id: string,
    status: ApplicationStatusPayload["status"]
  ) => {
    try {
      await updateStatus({ id, payload: { status } }).unwrap();
      message.success(
        status === "delete" ? "Application marked as deleted" : "Application status updated"
      );
    } catch {
      message.error("Could not update application status");
    }
  };

  const columns: ColumnsType<Application> = [
    {
      title: "Applicant",
      key: "applicant",
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
      title: "Phone",
      dataIndex: "phone",
      key: "phone",
      render: (phone: string) => phone || "—",
    },
    {
      title: "Company",
      dataIndex: "company_name",
      key: "company_name",
      render: (company: string) => company || "—",
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
      render: (status: ApplicationStatus, record) =>
        status === "delete" ? (
          <Tag color={statusColors.delete}>deleted</Tag>
        ) : (
          <Select
            size="small"
            value={status === "pending" ? undefined : status}
            placeholder={status === "pending" ? "Pending" : undefined}
            options={statusOptions}
            className="!min-w-28"
            onChange={(value) => onStatusChange(record._id, value)}
          />
        ),
    },
    {
      title: "Submitted",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (v?: string) => (v ? new Date(v).toLocaleDateString() : "—"),
    },
    {
      title: "Actions",
      key: "actions",
      width: 100,
      render: (_, record) => (
        <Space>
          <Button size="small" icon={<EyeOutlined />} onClick={() => openDetail(record)} />
          {record.status !== "delete" && (
            <Popconfirm
              title="Mark as deleted?"
              description="This will update the application status to deleted."
              onConfirm={() => onStatusChange(record._id, "delete")}
              okText="Delete"
              okButtonProps={{ danger: true }}
            >
              <Button size="small" danger>
                Delete
              </Button>
            </Popconfirm>
          )}
        </Space>
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        title="Applications"
        subtitle="Review and manage incoming business applications."
        extra={
          <>
            <Select
              placeholder="Filter by status"
              allowClear
              className="!w-40"
              value={statusFilter}
              onChange={setStatusFilter}
              options={[
                { value: "pending", label: "Pending" },
                { value: "reviewed", label: "Reviewed" },
                { value: "resolved", label: "Resolved" },
                { value: "delete", label: "Deleted" },
              ]}
            />
            <Input
              placeholder="Search applications"
              prefix={<SearchOutlined className="text-slate-400" />}
              onChange={(e) => setSearchTerm(e.target.value)}
              allowClear
              className="!w-56"
            />
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
        scroll={{ x: 1100 }}
      />

      <ApplicationDetailModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        application={selected}
        onStatusChange={onStatusChange}
      />
    </div>
  );
}
