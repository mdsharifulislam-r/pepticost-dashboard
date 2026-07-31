import { Modal, Descriptions, Tag, Select, Space, Button, Popconfirm } from "antd";
import type { Application, ApplicationStatus, ApplicationStatusPayload } from "@/types";

interface ApplicationDetailModalProps {
  open: boolean;
  onClose: () => void;
  application: Application | null;
  onStatusChange: (id: string, status: ApplicationStatusPayload["status"]) => void;
}

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

export default function ApplicationDetailModal({
  open,
  onClose,
  application,
  onStatusChange,
}: ApplicationDetailModalProps) {
  if (!application) return null;

  const handleStatusChange = (status: ApplicationStatusPayload["status"]) => {
    onStatusChange(application._id, status);
    onClose();
  };

  return (
    <Modal
      title="Application details"
      open={open}
      onCancel={onClose}
      footer={null}
      width={640}
      destroyOnHidden
    >
      <Descriptions column={1} bordered size="small" className="!mb-4">
        <Descriptions.Item label="Name">{application.name}</Descriptions.Item>
        <Descriptions.Item label="Email">{application.email}</Descriptions.Item>
        <Descriptions.Item label="Phone">{application.phone || "—"}</Descriptions.Item>
        <Descriptions.Item label="Company">{application.company_name || "—"}</Descriptions.Item>
        <Descriptions.Item label="Status">
          <Tag color={statusColors[application.status]}>{application.status}</Tag>
        </Descriptions.Item>
        <Descriptions.Item label="Submitted">
          {application.createdAt
            ? new Date(application.createdAt).toLocaleString()
            : "—"}
        </Descriptions.Item>
        <Descriptions.Item label="Message">{application.message}</Descriptions.Item>
      </Descriptions>

      {application.status !== "delete" && (
        <Space wrap>
          <Select
            placeholder="Update status"
            options={statusOptions}
            className="!min-w-40"
            onChange={handleStatusChange}
          />
          <Popconfirm
            title="Mark as deleted?"
            description="This will update the application status to deleted."
            onConfirm={() => handleStatusChange("delete")}
            okText="Delete"
            okButtonProps={{ danger: true }}
          >
            <Button danger>Delete application</Button>
          </Popconfirm>
        </Space>
      )}
    </Modal>
  );
}
