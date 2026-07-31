import { useEffect, useState } from "react";
import { Tabs, Form, Input, Button, App as AntApp, Typography } from "antd";
import { SaveOutlined } from "@ant-design/icons";
import PageHeader from "@/components/common/PageHeader";
import { useGetDisclaimerQuery, useUpsertDisclaimerMutation } from "@/features/disclaimer/disclaimerApi";
import type { DisclaimerType } from "@/types";

const { Text } = Typography;
const { TextArea } = Input;

const tabs: { key: DisclaimerType; label: string }[] = [
  { key: "terms", label: "Terms of Service" },
  { key: "privacy", label: "Privacy Policy" },
  { key: "about", label: "About" },
];

function DisclaimerEditor({ type }: { type: DisclaimerType }) {
  const { data, isFetching } = useGetDisclaimerQuery(type);
  const [upsertDisclaimer, { isLoading: saving }] = useUpsertDisclaimerMutation();
  const { message } = AntApp.useApp();
  const [form] = Form.useForm<{ content: string }>();

  useEffect(() => {
    form.setFieldsValue({ content: data?.data?.content ?? "" });
  }, [data, form]);

  const onFinish = async (values: { content: string }) => {
    try {
      await upsertDisclaimer({ type, content: values.content }).unwrap();
      message.success("Saved");
    } catch (err) {
      const description =
        (err as { data?: { message?: string } })?.data?.message ?? "Could not save changes";
      message.error(description);
    }
  };

  return (
    <div className="rounded-xl bg-white p-6 shadow-sm">
      <Text type="secondary" className="mb-4 block">
        This content is shown publicly on the site's {type} page.
      </Text>
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Form.Item
          name="content"
          rules={[{ required: true, message: "Please write some content" }]}
        >
          <TextArea rows={14} disabled={isFetching} placeholder="Write the page content here…" />
        </Form.Item>
        <Button type="primary" htmlType="submit" icon={<SaveOutlined />} loading={saving}>
          Save changes
        </Button>
      </Form>
    </div>
  );
}

export default function DisclaimerPage() {
  const [active, setActive] = useState<DisclaimerType>("terms");

  return (
    <div>
      <PageHeader
        title="Disclaimer & Pages"
        subtitle="Manage the Terms, Privacy Policy and About page content."
      />

      <Tabs
        activeKey={active}
        onChange={(key) => setActive(key as DisclaimerType)}
        items={tabs.map((tab) => ({
          key: tab.key,
          label: tab.label,
          children: <DisclaimerEditor type={tab.key} />,
        }))}
      />
    </div>
  );
}
