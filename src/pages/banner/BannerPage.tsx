import { useState } from "react";
import { Button, Table, Input, App as AntApp, Space, Popconfirm, Tag, Avatar, Image } from "antd";
import {
  PlusOutlined,
  SearchOutlined,
  EditOutlined,
  DeleteOutlined,
  FileImageOutlined,
} from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import PageHeader from "@/components/common/PageHeader";
import { useGetBannersQuery, useDeleteBannerMutation } from "@/features/banner/bannerApi";
import type { Banner } from "@/types";
import BannerFormModal from "@/pages/banner/BannerFormModal";
import { getImageUrl } from "@/api/baseApi";

export default function BannerPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const { data, isFetching } = useGetBannersQuery({ searchTerm: searchTerm || undefined });
  const [deleteBanner] = useDeleteBannerMutation();
  const { message } = AntApp.useApp();

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Banner | null>(null);

  const openCreate = () => {
    setEditing(null);
    setModalOpen(true);
  };

  const openEdit = (record: Banner) => {
    setEditing(record);
    setModalOpen(true);
  };

  const onDelete = async (id: string) => {
    try {
      await deleteBanner(id).unwrap();
      message.success("Banner deleted");
    } catch {
      message.error("Could not delete this banner");
    }
  };

  const columns: ColumnsType<Banner> = [
    {
      title: "Banner",
      dataIndex: "image",
      key: "banner",
      width: 150,
      render: (image: string, record) => (
        <Space>
          <Avatar
            shape="square"
            size={64}
            src={<Image src={getImageUrl(image)} alt={record.title} />}
            icon={<FileImageOutlined />}
          />
          <span className="font-medium text-slate-800">{record.title}</span>
        </Space>
      ),
    },
    {
      title: "Link",
      dataIndex: "link",
      key: "link",
      render: (link: string) => (
        <a href={link} target="_blank" rel="noopener noreferrer" className="text-teal-600">
          {link}
        </a>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: string) => (
        <Tag color={status === "active" ? "green" : "default"}>{status}</Tag>
      ),
    },
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
            title="Delete this banner?"
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
        title="Banners"
        subtitle="Manage promotional banners displayed on the website."
        extra={
          <>
            <Input
              placeholder="Search banners"
              prefix={<SearchOutlined className="text-slate-400" />}
              onChange={(e) => setSearchTerm(e.target.value)}
              allowClear
              className="w-56!"
            />
            <Button type="primary" icon={<PlusOutlined />} onClick={openCreate}>
              New banner
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

      <BannerFormModal open={modalOpen} onClose={() => setModalOpen(false)} editing={editing} />
    </div>
  );
}
