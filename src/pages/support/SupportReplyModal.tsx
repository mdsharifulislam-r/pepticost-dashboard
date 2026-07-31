import { useEffect } from "react";
import { Modal, Form, Input, App as AntApp } from "antd";
import { useReplySupportMessageMutation } from "@/features/support/supportApi";
import type { Support } from "@/types";

const { TextArea } = Input;

interface SupportReplyModalProps {
  open: boolean;
  onClose: () => void;
  support: Support | null;
}

interface ReplyFormValues {
  reply: string;
}

export default function SupportReplyModal({ open, onClose, support }: SupportReplyModalProps) {
  const [form] = Form.useForm<ReplyFormValues>();
  const [replySupportMessage, { isLoading: replying }] = useReplySupportMessageMutation();
  const { message } = AntApp.useApp();

  useEffect(() => {
    if (!open) return;
    form.resetFields();
  }, [open, form]);

  const onSubmit = async (values: ReplyFormValues) => {
    if (!support) return;

    try {
      await replySupportMessage({
        id: support._id,
        payload: { reply: values.reply },
      }).unwrap();
      message.success("Reply sent successfully");
      onClose();
    } catch (err) {
      const description =
        (err as { data?: { message?: string } })?.data?.message ?? "Something went wrong";
      message.error(description);
    }
  };

  return (
    <Modal
      title="Reply to Support Message"
      open={open}
      onCancel={onClose}
      onOk={() => form.submit()}
      confirmLoading={replying}
      okText="Send Reply"
      width={680}
      destroyOnHidden
    >
      <div className="mb-6 rounded-lg bg-slate-50 p-4">
        <div className="mb-3">
          <div className="text-xs font-semibold uppercase text-slate-500">From</div>
          <div className="text-sm font-medium text-slate-800">{support?.name}</div>
          <div className="text-xs text-slate-600">{support?.email}</div>
          {support?.contact && <div className="text-xs text-slate-600">{support.contact}</div>}
        </div>
        <div>
          <div className="text-xs font-semibold uppercase text-slate-500">Message</div>
          <div className="mt-1 text-sm text-slate-700">{support?.message}</div>
        </div>
      </div>

      <Form form={form} layout="vertical" onFinish={onSubmit}>
        <Form.Item
          label="Your Reply"
          name="reply"
          rules={[{ required: true, message: "Please enter a reply" }]}
        >
          <TextArea rows={6} placeholder="Type your response here..." />
        </Form.Item>
      </Form>
    </Modal>
  );
}
