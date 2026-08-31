import { useState } from "react";
import {
  Button,
  Table,
  Input,
  Select,
  App as AntApp,
  Space,
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
import type {
  Application,
  ApplicationStatus,
  ApplicationStatusPayload,
} from "@/types";
import ApplicationDetailModal from "@/pages/application/ApplicationDetailModal";

const { Text } = Typography;

const colorMap: Record<
  ApplicationStatus,
  { bg: string; text: string; border: string }
> = {
  pending: {
    bg: "bg-amber-50",
    text: "text-amber-700",
    border: "border-amber-200",
  },
  reviewed: {
    bg: "bg-blue-50",
    text: "text-blue-700",
    border: "border-blue-200",
  },
  resolved: {
    bg: "bg-emerald-50",
    text: "text-emerald-700",
    border: "border-emerald-200",
  },
  delete: {
    bg: "bg-rose-50",
    text: "text-rose-700",
    border: "border-rose-200",
  },
};

const statusOptions: {
  value: ApplicationStatusPayload["status"];
  label: string;
}[] = [
  { value: "reviewed", label: "Reviewed" },
  { value: "resolved", label: "Resolved" },
  { value: "delete", label: "Delete" },
];

export default function ApplicationPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    ApplicationStatus | undefined
  >();
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
    status: ApplicationStatusPayload["status"],
  ) => {
    try {
      await updateStatus({ id, payload: { status } }).unwrap();
      message.success(
        status === "delete"
          ? "Application marked as deleted"
          : "Application status updated",
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
        <div className="py-0.5">
          <div className="font-semibold text-slate-800 text-sm leading-snug">
            {record.name}
          </div>
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
      render: (phone: string) => (
        <span className="text-slate-600 text-sm">{phone || "—"}</span>
      ),
    },
    {
      title: "Company",
      dataIndex: "company_name",
      key: "company_name",
      render: (company: string) => (
        <span className="text-slate-700 text-sm font-medium">
          {company || "—"}
        </span>
      ),
    },
    {
      title: "Message",
      dataIndex: "message",
      key: "message",
      render: (msg: string) => (
        <span
          className="text-slate-500 text-xs line-clamp-2 max-w-60"
          title={msg}
        >
          {msg || "—"}
        </span>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: ApplicationStatus, record) => {
        const currentStatus = status === "pending" ? "pending" : status;
        const color = colorMap[currentStatus];
        return (
          <div
            className={`inline-flex items-center rounded-full px-2.5 py-0.5 border text-xs font-semibold ${color.bg} ${color.text} ${color.border}`}
          >
            <Select
              variant="borderless"
              size="small"
              value={status === "pending" ? undefined : status}
              placeholder={<span className={color.text}>Pending</span>}
              options={statusOptions}
              className="text-current! font-semibold [&_.ant-select-selection-item]:text-current! [&_.ant-select-arrow]:text-current!"
              onChange={(value) => onStatusChange(record._id, value)}
            />
          </div>
        );
      },
    },
    {
      title: "Submitted",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (v?: string) => (
        <span className="text-slate-600 text-sm">
          {v
            ? new Date(v).toLocaleDateString(undefined, {
                year: "numeric",
                month: "short",
                day: "numeric",
              })
            : "—"}
        </span>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      width: 140,
      render: (_, record) => (
        <Space size="small">
          <Button
            size="small"
            type="text"
            icon={<EyeOutlined className="text-indigo-600" />}
            onClick={() => openDetail(record)}
            className="hover:bg-indigo-50!"
          >
            View
          </Button>
          {record.status !== "delete" && (
            <Popconfirm
              title="Mark as deleted?"
              description="This will update the application status to deleted."
              onConfirm={() => onStatusChange(record._id, "delete")}
              okText="Delete"
              okButtonProps={{ danger: true }}
            >
              <Button
                size="small"
                type="text"
                danger
                className="hover:bg-rose-50!"
              >
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
              className="w-40!"
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
              className="w-56!"
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
        className="overflow-hidden rounded-xl bg-white shadow-sm border border-slate-100"
        scroll={{ x: "max-content" }}
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
