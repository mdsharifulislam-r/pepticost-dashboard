import { useState } from "react";
import { Button, Table, Input, App as AntApp, Space, Popconfirm, Tag, Avatar } from "antd";
import {
  PlusOutlined,
  SearchOutlined,
  EditOutlined,
  DeleteOutlined,
  FileImageOutlined,
} from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import PageHeader from "@/components/common/PageHeader";
import { useGetBlogsQuery, useDeleteBlogMutation } from "@/features/blog/blogApi";
import type { Blog } from "@/types";
import BlogFormModal from "@/pages/blog/BlogFormModal";
import { getImageUrl } from "@/api/baseApi";

export default function BlogPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState<number>(1);
  const { data, isFetching } = useGetBlogsQuery({ searchTerm: searchTerm || undefined, page });
  const [deleteBlog] = useDeleteBlogMutation();
  const { message } = AntApp.useApp();

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Blog | null>(null);

  const openCreate = () => {
    setEditing(null);
    setModalOpen(true);
  };

  const openEdit = (record: Blog) => {
    setEditing(record);
    setModalOpen(true);
  };

  const onDelete = async (id: string) => {
    try {
      await deleteBlog(id).unwrap();
      message.success("Blog post deleted");
    } catch {
      message.error("Could not delete this post");
    }
  };

  const columns: ColumnsType<Blog> = [
    {
      title: "Post",
      dataIndex: "headline",
      key: "headline",
      render: (headline: string, record) => (
        <Space>
          <Avatar shape="square" src={getImageUrl(record.image ?? "")} icon={<FileImageOutlined />} />
          <span className="font-medium text-slate-800">{headline}</span>
        </Space>
      ),
    },
    {
      title: "Category",
      dataIndex: "category",
      key: "category",
      render: (v: string) => <Tag color="blue">{v}</Tag>,
    },
    {
      title: "Tags",
      dataIndex: "tags",
      key: "tags",
      render: (tags: string[]) => (
        <Space size={4} wrap>
          {(tags ?? []).map((t) => (
            <Tag key={t}>{t}</Tag>
          ))}
        </Space>
      ),
    },
    {
      title: "Published",
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
            title="Delete this post?"
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
        title="Blog"
        subtitle="Write and manage posts published on the Pepticost blog."
        extra={
          <>
            <Input
              placeholder="Search posts"
              prefix={<SearchOutlined className="text-slate-400" />}
              onChange={(e) => setSearchTerm(e.target.value)}
              allowClear
              className="w-56!"
            />
            <Button type="primary" icon={<PlusOutlined />} onClick={openCreate}>
              New post
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

      <BlogFormModal open={modalOpen} onClose={() => setModalOpen(false)} editing={editing} />
    </div>
  );
}
