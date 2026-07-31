import { Card, Statistic, Typography } from "antd";
import {
  ExperimentOutlined,
  ShopOutlined,
  FileTextOutlined,
  QuestionCircleOutlined,
} from "@ant-design/icons";
import { useAppSelector } from "@/app/hooks";
import { useGetPeptidesQuery } from "@/features/peptides/peptidesApi";
import { useGetVendorsQuery } from "@/features/vendor/vendorApi";
import { useGetFaqsQuery } from "@/features/faq/faqApi";
import { useGetBlogsQuery } from "@/features/blog/blogApi";
import PageHeader from "@/components/common/PageHeader";

const { Text } = Typography;

export default function Dashboard() {
  const name = useAppSelector((state) => state.auth.name);
  const { data: peptides, isFetching: loadingPeptides } = useGetPeptidesQuery();
  const { data: vendors, isFetching: loadingVendors } = useGetVendorsQuery();
  const { data: faqs, isFetching: loadingFaqs } = useGetFaqsQuery();
  const { data: blogs, isFetching: loadingBlogs } = useGetBlogsQuery();

  const cards = [
    {
      title: "Peptides",
      value: peptides?.data.length ?? 0,
      loading: loadingPeptides,
      icon: <ExperimentOutlined />,
      color: "#0F766E",
    },
    {
      title: "Vendors",
      value: vendors?.data.length ?? 0,
      loading: loadingVendors,
      icon: <ShopOutlined />,
      color: "#2563EB",
    },
    {
      title: "Blog posts",
      value: blogs?.data.length ?? 0,
      loading: loadingBlogs,
      icon: <FileTextOutlined />,
      color: "#D97706",
    },
    {
      title: "FAQs",
      value: faqs?.data.length ?? 0,
      loading: loadingFaqs,
      icon: <QuestionCircleOutlined />,
      color: "#7C3AED",
    },
  ];

  return (
    <div>
      <PageHeader
        title={`Welcome back${name ? `, ${name}` : ""}`}
        subtitle="Here's a snapshot of what's live on Pepticost right now."
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((card) => (
          <Card key={card.title} className="!rounded-xl" variant="borderless">
            <div className="flex items-center justify-between">
              <Statistic
                title={card.title}
                value={card.value}
                loading={card.loading}
              />
              <div
                className="flex h-11 w-11 items-center justify-center rounded-lg text-lg text-white"
                style={{ backgroundColor: card.color }}
              >
                {card.icon}
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Card className="mt-4 !rounded-xl" variant="borderless">
        <Text type="secondary">
          Use the sidebar to manage peptides, vendor pricing, blog content, FAQs and
          the site's legal disclaimers.
        </Text>
      </Card>
    </div>
  );
}
