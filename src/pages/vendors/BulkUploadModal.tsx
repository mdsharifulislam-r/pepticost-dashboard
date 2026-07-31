import { useState } from "react";
import { Modal, Upload, Typography, App as AntApp } from "antd";
import { InboxOutlined } from "@ant-design/icons";
import type { UploadFile, UploadProps } from "antd";
import { useBulkUploadVendorsMutation } from "@/features/vendor/vendorApi";

const { Text } = Typography;
const { Dragger } = Upload;

interface BulkUploadModalProps {
  open: boolean;
  onClose: () => void;
}

export default function BulkUploadModal({ open, onClose }: BulkUploadModalProps) {
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [bulkUpload, { isLoading }] = useBulkUploadVendorsMutation();
  const { message } = AntApp.useApp();

  const props: UploadProps = {
    accept: ".csv",
    multiple: false,
    fileList,
    beforeUpload: (file) => {
      setFileList([file]);
      return false;
    },
    onRemove: () => setFileList([]),
  };

  const handleUpload = async () => {
    const file = fileList[0];
    if (!file) {
      message.warning("Please choose a CSV file first");
      return;
    }
    const formData = new FormData();
    formData.append("doc", file as unknown as File);

    try {
      await bulkUpload(formData).unwrap();
      message.success("Vendors imported successfully");
      setFileList([]);
      onClose();
    } catch (err) {
      const description =
        (err as { data?: { message?: string } })?.data?.message ?? "Upload failed";
      message.error(description);
    }
  };

  return (
    <Modal
      title="Bulk upload vendors"
      open={open}
      onCancel={() => {
        setFileList([]);
        onClose();
      }}
      onOk={handleUpload}
      confirmLoading={isLoading}
      okText="Upload"
      destroyOnHidden
    >
      <Text type="secondary" className="mb-3 block">
        Upload a CSV file of vendor listings to import them in bulk.
      </Text>
      <Dragger {...props} className="!mt-2">
        <p className="ant-upload-drag-icon">
          <InboxOutlined />
        </p>
        <p className="ant-upload-text">Click or drag a CSV file to this area</p>
        <p className="ant-upload-hint">Only .csv files are supported</p>
      </Dragger>
    </Modal>
  );
}
