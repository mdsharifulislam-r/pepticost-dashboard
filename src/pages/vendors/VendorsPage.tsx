import { useState } from "react";
import {
  Button,
  Table,
  Input,
  Select,
  Space,
  Tag,
  Popconfirm,
  App as AntApp,
  Rate,
} from "antd";
import {
  PlusOutlined,
  SearchOutlined,
  EditOutlined,
  DeleteOutlined,
  UploadOutlined,
  CheckCircleFilled,
} from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import PageHeader from "@/components/common/PageHeader";
import { useGetPeptidesQuery } from "@/features/peptides/peptidesApi";
import {
  useGetVendorsQuery,
  useDeleteVendorMutation,
} from "@/features/vendor/vendorApi";
import type { Vendor } from "@/types";
import VendorFormModal from "@/pages/vendors/VendorFormModal";
import BulkUploadModal from "@/pages/vendors/BulkUploadModal";

export default function VendorsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState<number>(1);
  const [peptideFilter, setPeptideFilter] = useState<string | undefined>();
  const { data: peptides } = useGetPeptidesQuery({});
  const { data, isFetching } = useGetVendorsQuery({
    searchTerm: searchTerm || undefined,
    peptide: peptideFilter,
    page,
  });
  const [deleteVendor] = useDeleteVendorMutation();
  const { message } = AntApp.useApp();

  const [modalOpen, setModalOpen] = useState(false);
  const [bulkOpen, setBulkOpen] = useState(false);
  const [editing, setEditing] = useState<Vendor | null>(null);

  const openCreate = () => {
    setEditing(null);
    setModalOpen(true);
  };

  const openEdit = (record: Vendor) => {
    setEditing(record);
    setModalOpen(true);
  };

  const onDelete = async (id: string) => {
    try {
      await deleteVendor(id).unwrap();
      message.success("Vendor listing deleted");
    } catch {
      message.error("Could not delete this listing");
    }
  };

  const columns: ColumnsType<Vendor> = [
    {
      title: "Listing",
      dataIndex: "name",
      key: "name",
      render: (name: string, record) => (
        <Space direction="vertical" size={0}>
          <span className="font-medium text-slate-800">{name}</span>
          {record.is_verified && (
            <span className="flex items-center gap-1 text-xs text-teal-700">
              <CheckCircleFilled /> Verified
            </span>
          )}
        </Space>
      ),
    },
    {
      title: "Peptide",
      dataIndex: "peptide",
      key: "peptide",
      render: (peptide: Vendor["peptide"]) =>
        typeof peptide === "string" ? peptide : (peptide?.name ?? "—"),
    },
    {
      title: "Price",
      dataIndex: "price_per_unit",
      key: "price_per_unit",
      render: (v: number, record) => (
        <Space direction="vertical" size={0}>
          <span>${v?.toFixed(2)}</span>
          {record.has_discount && (
            <Tag color="gold" className="!m-0 w-fit">
              -{record.discount_amount}%{" "}
              {record.coupon_code ? `· ${record.coupon_code}` : ""}
            </Tag>
          )}
        </Space>
      ),
    },
    {
      title: "Stock",
      dataIndex: "is_stock",
      key: "is_stock",
      render: (inStock?: boolean) => (
        <Tag color={inStock !== false ? "green" : "red"}>
          {inStock !== false ? "In stock" : "Out of stock"}
        </Tag>
      ),
    },
    {
      title: "Delivery",
      dataIndex: "delivery_cost",
      key: "delivery_cost",
      render: (v?: number) => (v != null ? `$${v.toFixed(2)}` : "—"),
    },
    {
      title: "Payment",
      dataIndex: "payment_methods",
      key: "payment_methods",
      render: (methods?: Vendor["payment_methods"]) => (
        <Space size={4} wrap>
          {(methods ?? []).length > 0
            ? methods!.map((m) => <Tag key={m}>{m}</Tag>)
            : "—"}
        </Space>
      ),
    },
    {
      title: "Quality",
      dataIndex: "quality",
      key: "quality",
      render: (v: string) => (v ? <Tag>{v}</Tag> : "—"),
    },
    {
      title: "Rating",
      dataIndex: "rating",
      key: "rating",
      render: (v: number) => (
        <Rate disabled allowHalf defaultValue={v} className="!text-sm" />
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (v: Vendor["status"]) => (
        <Tag color={v === "active" ? "green" : "red"}>{v}</Tag>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      width: 120,
      render: (_, record) => (
        <Space>
          <Button
            size="small"
            icon={<EditOutlined />}
            onClick={() => openEdit(record)}
          />
          <Popconfirm
            title="Delete this listing?"
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
        title="Vendors"
        subtitle="Manage vendor pricing listings shown on the site."
        extra={
          <>
            <Select
              placeholder="Filter by peptide"
              allowClear
              className="!w-48"
              value={peptideFilter}
              onChange={setPeptideFilter}
              options={peptides?.data.map((p) => ({
                value: p._id,
                label: p.name,
              }))}
            />
            <Input
              placeholder="Search vendors"
              prefix={<SearchOutlined className="text-slate-400" />}
              onChange={(e) => setSearchTerm(e.target.value)}
              allowClear
              className="!w-56"
            />
            <Button icon={<UploadOutlined />} onClick={() => setBulkOpen(true)}>
              Bulk upload
            </Button>
            <Button type="primary" icon={<PlusOutlined />} onClick={openCreate}>
              Add vendor
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
          onChange: (page) => setPage(page),
        }}
        className="overflow-hidden rounded-xl bg-white shadow-sm"
        scroll={{ x: 1200 }}
      />

      <VendorFormModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        editing={editing}
      />
      <BulkUploadModal open={bulkOpen} onClose={() => setBulkOpen(false)} />
    </div>
  );
}
