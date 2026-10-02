import { useMemo, useState } from "react";
import {
  Button,
  Table,
  Input,
  App as AntApp,
  Space,
  Popconfirm,
  Tag,
  Select,
  Alert,
  Typography,
} from "antd";
import {
  PlusOutlined,
  SearchOutlined,
  EditOutlined,
  DeleteOutlined,
  FileImageOutlined,
  FilePdfOutlined,
} from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import PageHeader from "@/components/common/PageHeader";
import { getImageUrl } from "@/api/baseApi";
import {
  useDeletePeptideInfoMutation,
  useGetPeptideInfosQuery,
} from "@/features/peptideInfo/peptideInfoApi";
import type { PeptideInfo, PeptideInfoStatus } from "@/types";
import PeptideInfoFormModal from "@/pages/peptideInfo/PeptideInfoFormModal";

const statusColors: Record<PeptideInfoStatus, string> = {
  active: "green",
  inactive: "orange",
  delete: "red",
};

const statusOptions = [
  { value: "all", label: "All statuses" },
  { value: "active", label: "Active" },
  { value: "inactive", label: "Inactive" },
  { value: "delete", label: "Deleted" },
];

export default function PeptideInfoPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<PeptideInfoStatus | "all">("all");
  const [page, setPage] = useState<number>(1);
  const { data, isFetching, isError, error } = useGetPeptideInfosQuery({
    page,
    searchTerm: searchTerm || undefined,
    status: statusFilter === "all" ? undefined : statusFilter,
  });
  const [deletePeptideInfo] = useDeletePeptideInfoMutation();
  const { message } = AntApp.useApp();
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<PeptideInfo | null>(null);

  const records = data?.data ?? [];

  const openCreate = () => {
    setEditing(null);
    setModalOpen(true);
  };

  const openEdit = (record: PeptideInfo) => {
    setEditing(record);
    setModalOpen(true);
  };

  const onDelete = async (record: PeptideInfo) => {
    try {
      await deletePeptideInfo(record._id).unwrap();
      message.success("Peptide info record deleted.");
    } catch {
      message.error("Unable to delete this peptide info record.");
    }
  };

  const columns: ColumnsType<PeptideInfo> = useMemo(
    () => [
      {
        title: "Headline",
        dataIndex: "headline",
        key: "headline",
        width: 260,
        render: (headline: string, record) => (
          <Space align="start">
            {record.thumbnail ? (
              <img
                src={getImageUrl(record.thumbnail)}
                alt={headline}
                className="h-12 w-12 rounded-md object-cover"
              />
            ) : (
              <div className="flex h-12 w-12 items-center justify-center rounded-md bg-slate-100 text-slate-500">
                <FileImageOutlined />
              </div>
            )}
            <div>
              <Typography.Text strong className="block text-slate-800">
                {headline}
              </Typography.Text>
              <Typography.Text type="secondary" className="text-xs">
                {record.category}
              </Typography.Text>
            </div>
          </Space>
        ),
      },
      {
        title: "Category",
        dataIndex: "category",
        key: "category",
        render: (category: string) => <Tag color="blue">{category}</Tag>,
      },
      {
        title: "Tags",
        dataIndex: "tags",
        key: "tags",
        render: (tags: string[] = []) => (
          <Space size={4} wrap>
            {tags.map((tag) => (
              <Tag key={tag}>{tag}</Tag>
            ))}
          </Space>
        ),
      },
      {
        title: "Files",
        key: "files",
        width: 160,
        render: (_, record) => (
          <Space direction="vertical" size={4}>
            {record.thumbnail ? (
              <a href={getImageUrl(record.thumbnail)} target="_blank" rel="noreferrer">
                Thumbnail
              </a>
            ) : (
              <span className="text-slate-400">No image</span>
            )}
            {record.pdf ? (
              <a href={getImageUrl(record.pdf)} target="_blank" rel="noreferrer">
                <FilePdfOutlined className="mr-1" /> PDF
              </a>
            ) : (
              <span className="text-slate-400">No PDF</span>
            )}
          </Space>
        ),
      },
      {
        title: "Status",
        dataIndex: "status",
        key: "status",
        render: (status: PeptideInfoStatus) => (
          <Tag color={statusColors[status] ?? "default"}>{status}</Tag>
        ),
      },
      {
        title: "Updated",
        dataIndex: "updatedAt",
        key: "updatedAt",
        render: (value?: string) => (value ? new Date(value).toLocaleDateString() : "—"),
      },
      {
        title: "Actions",
        key: "actions",
        width: 150,
        render: (_, record) => (
          <Space>
            <Button size="small" icon={<EditOutlined />} onClick={() => openEdit(record)} />
            <Popconfirm
              title="Delete this peptide info?"
              description="This will remove the record from the admin list."
              onConfirm={() => onDelete(record)}
              okText="Delete"
              okButtonProps={{ danger: true }}
            >
              <Button size="small" danger icon={<DeleteOutlined />} />
            </Popconfirm>
          </Space>
        ),
      },
    ],
    []
  );

  return (
    <div>
      <PageHeader
        title="Peptide Info"
        subtitle="Manage peptide information records with thumbnails, PDFs, and metadata."
        extra={
          <>
            <Input
              placeholder="Search headline or category"
              prefix={<SearchOutlined className="text-slate-400" />}
              value={searchTerm}
              onChange={(e) => {
                setPage(1);
                setSearchTerm(e.target.value);
              }}
              allowClear
              className="w-64!"
            />
            <Select
              value={statusFilter}
              options={statusOptions}
              onChange={(value) => {
                setPage(1);
                setStatusFilter(value as PeptideInfoStatus | "all");
              }}
              className="w-40"
            />
            <Button type="primary" icon={<PlusOutlined />} onClick={openCreate}>
              New record
            </Button>
          </>
        }
      />

      {isError && (
        <Alert
          type="error"
          showIcon
          message="Unable to load peptide info records"
          description={
            (error as { data?: { message?: string } })?.data?.message ??
            "Please check your connection and try again."
          }
          className="mb-4"
        />
      )}

      <Table
        rowKey="_id"
        loading={isFetching}
        dataSource={records}
        columns={columns}
        locale={{ emptyText: "No peptide info records found" }}
        pagination={{
          pageSize: data?.pagination?.limit ?? 10,
          total: data?.pagination?.total ?? 0,
          current: data?.pagination?.page ?? 1,
          onChange: (nextPage) => setPage(nextPage),
          showSizeChanger: false,
        }}
        className="overflow-hidden rounded-xl bg-white shadow-sm"
      />

      <PeptideInfoFormModal open={modalOpen} onClose={() => setModalOpen(false)} editing={editing} />
    </div>
  );
}
