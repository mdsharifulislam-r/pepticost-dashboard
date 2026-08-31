import { useState } from "react";
import { Select, Alert, Button, Spin, Typography } from "antd";
import {
  Store,
  MessageSquare,
  BookOpen,
  ClipboardList,
  TrendingUp,
  Calendar,
  AlertTriangle,
  ArrowRight,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useAppSelector } from "@/app/hooks";
import PageHeader from "@/components/common/PageHeader";
import {
  useGetAdminStatsQuery,
  useGetApplicationGraphQuery,
} from "@/features/dashboard/dashboardApi";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

const { Text } = Typography;

// Custom Tooltip for Recharts
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-xl border border-slate-100 bg-white/95 p-3 shadow-lg backdrop-blur-sm">
        <p className="text-xs font-semibold text-slate-500">{label}</p>
        <p className="mt-1 text-sm font-bold text-slate-800">
          Applications:{" "}
          <span className="text-indigo-600">{payload[0].value}</span>
        </p>
      </div>
    );
  }
  return null;
};

// Skeletons for Loading State
const CardSkeleton = () => (
  <div className="animate-pulse rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
    <div className="flex items-center justify-between">
      <div className="space-y-3">
        <div className="h-4 w-24 rounded bg-slate-200" />
        <div className="h-8 w-16 rounded bg-slate-200" />
        <div className="h-3 w-32 rounded bg-slate-200" />
      </div>
      <div className="h-12 w-12 rounded-xl bg-slate-200" />
    </div>
  </div>
);

const ChartSkeleton = () => (
  <div className="flex h-72 w-full flex-col items-center justify-center space-y-4 rounded-xl bg-slate-50/50">
    <Spin size="large" />
    <span className="text-sm text-slate-400 animate-pulse">
      Loading trend data...
    </span>
  </div>
);

export default function Dashboard() {
  const name = useAppSelector((state) => state.auth.name);
  const [selectedYear, setSelectedYear] = useState<number>(
    new Date().getFullYear(),
  );

  // API Queries
  const {
    data: statsData,
    isFetching: loadingStats,
    error: statsError,
    refetch: refetchStats,
  } = useGetAdminStatsQuery();

  const {
    data: graphData,
    isFetching: loadingGraph,
    error: graphError,
    refetch: refetchGraph,
  } = useGetApplicationGraphQuery({ year: selectedYear });

  const handleRetryAll = () => {
    refetchStats();
    refetchGraph();
  };

  // Stats Configuration
  const statsCards = [
    {
      title: "Total Vendors",
      value: statsData?.data.vendors ?? 0,
      icon: Store,
      gradient: "from-emerald-500 to-teal-600",
      iconBg: "bg-emerald-50 text-emerald-600",
      description: "Registered suppliers",
      link: "/vendors",
    },
    {
      title: "Support Messages",
      value: statsData?.data.supportMessages ?? 0,
      icon: MessageSquare,
      gradient: "from-rose-500 to-pink-600",
      iconBg: "bg-rose-50 text-rose-600",
      description: "Awaiting response",
      link: "/support",
    },
    {
      title: "Blog Posts",
      value: statsData?.data.blogs ?? 0,
      icon: BookOpen,
      gradient: "from-amber-500 to-orange-600",
      iconBg: "bg-amber-50 text-amber-600",
      description: "Published articles",
      link: "/blog",
    },
    {
      title: "Applications",
      value: statsData?.data.applications ?? 0,
      icon: ClipboardList,
      gradient: "from-blue-500 to-cyan-600",
      iconBg: "bg-blue-50 text-blue-600",
      description: "Business submissions",
      link: "/applications",
    },
  ];

  // Year Selection Options
  const yearOptions = graphData?.data?.yearWise?.map((y) => y.year) || [];
  const years = Array.from(
    new Set([new Date().getFullYear(), ...yearOptions]),
  ).sort((a, b) => b - a);

  return (
    <div className="space-y-6">
      <PageHeader
        title={`Welcome back${name ? `, ${name}` : ""}`}
        subtitle="Here's a snapshot of what's live on Pepticost right now."
        extra={
          (statsError || graphError) && (
            <Button
              type="primary"
              danger
              icon={<AlertTriangle className="h-4 w-4" />}
              onClick={handleRetryAll}
            >
              Retry Failed Requests
            </Button>
          )
        }
      />

      {/* Main Error Alert */}
      {(statsError || graphError) && (
        <Alert
          message="Connection Issue"
          description="We encountered an error fetching the latest dashboard statistics or graph data. Please verify your connection or try again."
          type="error"
          showIcon
          className="rounded-xl shadow-sm"
        />
      )}

      {/* Stats Cards Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {loadingStats
          ? Array.from({ length: 4 }).map((_, idx) => (
              <CardSkeleton key={idx} />
            ))
          : statsCards.map((card) => (
              <Link
                key={card.title}
                to={card.link}
                className="relative block overflow-hidden rounded-2xl border border-white/60 bg-white/70 p-6 shadow-sm backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-indigo-500/30 hover:shadow-md hover:shadow-indigo-500/5 group"
              >
                {/* Decorative Background Blob */}
                <div
                  className={`absolute -right-8 -top-8 h-32 w-32 rounded-full bg-linear-to-br ${card.gradient} opacity-[0.06] blur-2xl transition-all duration-500 group-hover:scale-125 group-hover:opacity-10`}
                />

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                      {card.title}
                    </span>
                    <h3 className="text-3xl font-extrabold tracking-tight text-slate-800">
                      {card.value}
                    </h3>
                    <p className="text-xs text-slate-500">{card.description}</p>
                  </div>
                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-xl ${card.iconBg} shadow-sm transition-all duration-300 group-hover:scale-110 group-hover:shadow-md`}
                  >
                    <card.icon className="h-6 w-6" />
                  </div>
                </div>

                {/* Bottom link indicator */}
                <div className="mt-4 flex items-center gap-1 text-[11px] font-semibold text-slate-400 transition-colors duration-300 group-hover:text-indigo-600">
                  <span>Manage</span>
                  <ArrowRight className="h-3 w-3 transition-transform duration-300 group-hover:translate-x-1" />
                </div>
              </Link>
            ))}
      </div>

      {/* Chart Section */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Monthly Trend Chart */}
        <div className="rounded-2xl border border-white/60 bg-white/70 p-6 shadow-sm backdrop-blur-md flex flex-col">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
            <div>
              min-w-30!
              <h4 className="text-base font-bold text-slate-800">
                Monthly Applications
              </h4>
              <p className="text-xs text-slate-500">
                Breakdown for the selected year
              </p>
            </div>
            <Select
              value={selectedYear}
              onChange={(value) => setSelectedYear(value)}
              className="min-w-30!"
              suffixIcon={<Calendar className="h-4 w-4 text-slate-400" />}
              options={years.map((y) => ({ value: y, label: `${y}` }))}
            />
          </div>

          {loadingGraph ? (
            <ChartSkeleton />
          ) : graphError ? (
            <div className="flex h-72 flex-col items-center justify-center text-center">
              <AlertTriangle className="h-8 w-8 text-rose-500 mb-2" />
              <p className="text-sm font-semibold text-slate-700">
                Failed to load monthly trend
              </p>
              <Button
                size="small"
                type="primary"
                className="mt-2"
                onClick={refetchGraph}
              >
                Retry
              </Button>
            </div>
          ) : (
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={graphData?.data?.monthlyBreakdown || []}
                  margin={{ left: -20, right: 10, top: 10, bottom: 0 }}
                >
                  <defs>
                    <linearGradient
                      id="monthlyAreaGrad"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#4f46e5" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#f1f5f9"
                    vertical={false}
                  />
                  <XAxis
                    dataKey="month"
                    stroke="#94a3b8"
                    fontSize={11}
                    tickLine={false}
                    axisLine={false}
                    dy={10}
                  />
                  <YAxis
                    stroke="#94a3b8"
                    fontSize={11}
                    tickLine={false}
                    axisLine={false}
                    dx={-10}
                    allowDecimals={false}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Area
                    type="monotone"
                    dataKey="count"
                    stroke="#4f46e5"
                    strokeWidth={2.5}
                    fillOpacity={1}
                    fill="url(#monthlyAreaGrad)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        {/* Yearly Trend Chart */}
        <div className="rounded-2xl border border-white/60 bg-white/70 p-6 shadow-sm backdrop-blur-md flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h4 className="text-base font-bold text-slate-800">
                Yearly Growth
              </h4>
              <p className="text-xs text-slate-500">
                Growth trajectory over years
              </p>
            </div>
            <div className="flex items-center gap-1.5 rounded-lg bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-600">
              <TrendingUp className="h-3.5 w-3.5" />
              <span>Overall Growth</span>
            </div>
          </div>

          {loadingGraph ? (
            <ChartSkeleton />
          ) : graphError ? (
            <div className="flex h-72 flex-col items-center justify-center text-center">
              <AlertTriangle className="h-8 w-8 text-rose-500 mb-2" />
              <p className="text-sm font-semibold text-slate-700">
                Failed to load yearly trend
              </p>
              <Button
                size="small"
                type="primary"
                className="mt-2"
                onClick={refetchGraph}
              >
                Retry
              </Button>
            </div>
          ) : (
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={graphData?.data?.yearWise || []}
                  margin={{ left: -20, right: 10, top: 10, bottom: 0 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#f1f5f9"
                    vertical={false}
                  />
                  <XAxis
                    dataKey="year"
                    stroke="#94a3b8"
                    fontSize={11}
                    tickLine={false}
                    axisLine={false}
                    dy={10}
                  />
                  <YAxis
                    stroke="#94a3b8"
                    fontSize={11}
                    tickLine={false}
                    axisLine={false}
                    dx={-10}
                    allowDecimals={false}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Line
                    type="monotone"
                    dataKey="count"
                    stroke="#10b981"
                    strokeWidth={3}
                    activeDot={{ r: 6, strokeWidth: 0, fill: "#10b981" }}
                    dot={{
                      r: 4,
                      strokeWidth: 2,
                      fill: "#fff",
                      stroke: "#10b981",
                    }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      </div>

      {/* Info/Guide Section */}
      <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h4 className="text-sm font-bold text-slate-800 mb-1">
            Administrative Quick Guide
          </h4>
          <Text type="secondary" className="text-xs">
            Use the sidebar to manage peptides, vendor pricing, blog content,
            FAQs and the site's legal disclaimers.
          </Text>
        </div>
        <div className="flex gap-2">
          <Link to="/profile">
            <Button size="small">Edit Profile</Button>
          </Link>
          <Link to="/support">
            <Button size="small" type="primary">
              Support Center
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
