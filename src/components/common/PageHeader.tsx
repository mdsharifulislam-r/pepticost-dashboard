import type { ReactNode } from "react";
import { Typography } from "antd";

const { Title, Text } = Typography;

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  extra?: ReactNode;
}

export default function PageHeader({ title, subtitle, extra }: PageHeaderProps) {
  return (
    <div className="admin-page-header flex flex-wrap items-center justify-between gap-3">
      <div>
        <Title level={3} className="!mb-0 !text-[28px] !tracking-[-0.04em]">
          {title}
        </Title>
        {subtitle && (
          <Text type="secondary" className="!text-sm !leading-6">
            {subtitle}
          </Text>
        )}
      </div>
      {extra && <div className="flex items-center gap-2">{extra}</div>}
    </div>
  );
}
