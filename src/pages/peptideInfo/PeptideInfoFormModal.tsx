import { useEffect, useMemo, useState } from "react";
import { Modal, Form, Input, Select, Upload, App as AntApp, Alert, Tag } from "antd";
import { FilePdfOutlined, PictureOutlined } from "@ant-design/icons";
import type { UploadFile } from "antd";
import RichTextEditor, { isRichTextEmpty } from "@/components/common/RichTextEditor";
import { getImageUrl } from "@/api/baseApi";
import {
  useCreatePeptideInfoMutation,
  useUpdatePeptideInfoMutation,
} from "@/features/peptideInfo/peptideInfoApi";
import type { PeptideInfo, PeptideInfoStatus } from "@/types";

interface PeptideInfoFormModalProps {
  open: boolean;
  onClose: () => void;
  editing: PeptideInfo | null;
}

interface PeptideInfoFormValues {
  headline: string;
  content: string;
  category: string;
  tags: string;
  status: PeptideInfoStatus;
}

const statusOptions: { value: PeptideInfoStatus; label: string }[] = [
  { value: "active", label: "Active" },
  { value: "inactive", label: "Inactive" },
  { value: "delete", label: "Delete" },
];

const toFileList = (url?: string, fallbackName?: string): UploadFile[] => {
  if (!url) return [];
  const fileName = fallbackName ?? url.split("/").pop() ?? "uploaded-file";
  return [
    {
      uid: `${fileName}-${Math.random()}`,
      name: fileName,
      status: "done",
      url: getImageUrl(url),
    },
  ];
};

export default function PeptideInfoFormModal({
  open,
  onClose,
  editing,
}: PeptideInfoFormModalProps) {
  const [form] = Form.useForm<PeptideInfoFormValues>();
  const [thumbnailList, setThumbnailList] = useState<UploadFile[]>([]);
  const [pdfList, setPdfList] = useState<UploadFile[]>([]);
  const [createPeptideInfo, { isLoading: creating }] = useCreatePeptideInfoMutation();
  const [updatePeptideInfo, { isLoading: updating }] = useUpdatePeptideInfoMutation();
  const { message } = AntApp.useApp();

  const existingThumbnailUrl = useMemo(
    () => editing?.thumbnail ?? "",
    [editing]
  );
  const existingPdfUrl = useMemo(() => editing?.pdf ?? "", [editing]);

  useEffect(() => {
    if (!open) return;

    if (editing) {
      form.setFieldsValue({
        headline: editing.headline,
        content: editing.content,
        category: editing.category,
        tags: editing.tags?.join(", ") ?? "",
        status: editing.status,
      });
      setThumbnailList(toFileList(editing.thumbnail, "thumbnail"));
      setPdfList(toFileList(editing.pdf, "document.pdf"));
    } else {
      form.resetFields();
      form.setFieldValue("status", "active");
      setThumbnailList([]);
      setPdfList([]);
    }
  }, [open, editing, form]);

  const handleSubmit = async (values: PeptideInfoFormValues) => {
    if (!thumbnailList.length && !editing) {
      message.error("Please upload a thumbnail image.");
      return;
    }

    if (!pdfList.length && !editing) {
      message.error("Please upload a PDF file.");
      return;
    }

    const tags = values.tags
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean);

    const formData = new FormData();
    formData.append("headline", values.headline.trim());
    formData.append("content", values.content.trim());
    formData.append("category", values.category.trim());
    formData.append("status", values.status);

    tags.forEach((tag) => formData.append("tags[]", tag));

    const newThumbnail = thumbnailList.find((file) => file.originFileObj)?.originFileObj;
    if (newThumbnail) {
      formData.append("image", newThumbnail);
    }

    const newPdf = pdfList.find((file) => file.originFileObj)?.originFileObj;
    if (newPdf) {
      formData.append("pdf", newPdf);
    }

    try {
      if (editing) {
        await updatePeptideInfo({ id: editing._id, formData }).unwrap();
        message.success("Peptide info updated successfully.");
      } else {
        await createPeptideInfo(formData).unwrap();
        message.success("Peptide info created successfully.");
      }
      onClose();
    } catch (err) {
      const description =
        (err as { data?: { message?: string } })?.data?.message ??
        "The peptide info could not be saved.";
      message.error(description);
    }
  };

  return (
    <Modal
      title={editing ? "Edit peptide info" : "Add peptide info"}
      open={open}
      onCancel={onClose}
      onOk={() => form.submit()}
      confirmLoading={creating || updating}
      okText={editing ? "Save changes" : "Create"}
      width={900}
      destroyOnHidden
    >
      <Form form={form} layout="vertical" onFinish={handleSubmit} className="mt-4">
        <Form.Item
          label="Headline"
          name="headline"
          rules={[{ required: true, message: "Please enter a headline" }]}
        >
          <Input placeholder="e.g. Peptide potency overview" />
        </Form.Item>

        <Form.Item label="Category" name="category">
          <Input placeholder="e.g. Research, Protocols, Clinical, Safety" />
        </Form.Item>

        <Form.Item
          label="Tags"
          name="tags"
          extra="Separate tags with commas"
        >
          <Input placeholder="peptide, research, protocol" />
        </Form.Item>

        <Form.Item
          label="Status"
          name="status"
          initialValue="active"
          rules={[{ required: true, message: "Please select a status" }]}
        >
          <Select options={statusOptions} />
        </Form.Item>

        <Form.Item
          label="Content"
          name="content"
          rules={[
            {
              validator: (_, value) =>
                isRichTextEmpty(value)
                  ? Promise.reject(new Error("Please enter the content"))
                  : Promise.resolve(),
            },
          ]}
        >
          <RichTextEditor
            placeholder="Add the content for this peptide info entry"
            minHeight={280}
          />
        </Form.Item>

        <div className="grid gap-4 md:grid-cols-2">
          <Form.Item label="Thumbnail image">
            <Upload
              listType="picture-card"
              fileList={thumbnailList}
              beforeUpload={(file) => {
                setThumbnailList([
                  {
                    uid: file.uid,
                    name: file.name,
                    status: "done",
                    originFileObj: file,
                  },
                ]);
                return false;
              }}
              onRemove={() => setThumbnailList([])}
              maxCount={1}
              showUploadList={{ showPreviewIcon: false }}
            >
              {thumbnailList.length === 0 && (
                <div className="flex flex-col items-center justify-center text-slate-500">
                  <PictureOutlined />
                  <div className="mt-2 text-xs">Upload</div>
                </div>
              )}
            </Upload>
            {existingThumbnailUrl && !thumbnailList.length && (
              <a href={getImageUrl(existingThumbnailUrl)} target="_blank" rel="noreferrer">
                View current thumbnail
              </a>
            )}
          </Form.Item>

          <Form.Item label="PDF document">
            <Upload
              listType="text"
              fileList={pdfList}
              beforeUpload={(file) => {
                setPdfList([
                  {
                    uid: file.uid,
                    name: file.name,
                    status: "done",
                    originFileObj: file,
                  },
                ]);
                return false;
              }}
              onRemove={() => setPdfList([])}
              maxCount={1}
              showUploadList={{ showPreviewIcon: false }}
            >
              {pdfList.length === 0 && (
                <div className="flex flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-slate-300 p-4 text-slate-500">
                  <FilePdfOutlined style={{ fontSize: 20 }} />
                  <span className="text-xs">Upload PDF</span>
                </div>
              )}
            </Upload>
            {existingPdfUrl && !pdfList.length && (
              <a href={getImageUrl(existingPdfUrl)} target="_blank" rel="noreferrer">
                View current PDF
              </a>
            )}
          </Form.Item>
        </div>

        {editing && (
          <Alert
            type="info"
            showIcon
            message="Upload a new file to replace the existing thumbnail or PDF."
            className="mt-2"
          />
        )}

        <div className="mt-3 flex flex-wrap gap-2">
          <Tag color="blue">Thumbnail</Tag>
          <Tag color="purple">PDF</Tag>
          <Tag color="green">Status aware</Tag>
        </div>
      </Form>
    </Modal>
  );
}
