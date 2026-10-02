import { useMemo, useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { Layout, Menu, Avatar, Dropdown, Typography, Grid, Button } from "antd";
import type { MenuProps } from "antd";
import {
  DashboardOutlined,
  ExperimentOutlined,
  ShopOutlined,
  FileTextOutlined,
  QuestionCircleOutlined,
  FileProtectOutlined,
  PictureOutlined,
  BookOutlined,
  CustomerServiceOutlined,
  FormOutlined,
  UserOutlined,
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  BellOutlined,
} from "@ant-design/icons";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { logout } from "@/features/auth/authSlice";

const { Header, Sider, Content } = Layout;
const { Text } = Typography;
const { useBreakpoint } = Grid;

const navItems = [
  { key: "/", icon: <DashboardOutlined />, label: "Dashboard" },
  { key: "/peptides", icon: <ExperimentOutlined />, label: "Peptides" },
  { key: "/vendors", icon: <ShopOutlined />, label: "Vendors" },
  { key: "/blog", icon: <FileTextOutlined />, label: "Blog" },
  { key: "/faq", icon: <QuestionCircleOutlined />, label: "FAQ" },
  { key: "/disclaimer", icon: <FileProtectOutlined />, label: "Disclaimer" },
  { key: "/banner", icon: <PictureOutlined />, label: "Banners" },
  { key: "/peptide-info", icon: <BookOutlined />, label: "Peptide Info" },
  { key: "/support", icon: <CustomerServiceOutlined />, label: "Support" },
  { key: "/applications", icon: <FormOutlined />, label: "Applications" },
];

export default function AdminLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();
  const screens = useBreakpoint();
  const name = useAppSelector((state) => state.auth.name);
  const email = useAppSelector((state) => state.auth.email);
  const role = useAppSelector((state) => state.auth.role);

  const selectedKey = useMemo(() => {
    const match = navItems.find(
      (item) => item.key !== "/" && location.pathname.startsWith(item.key)
    );
    return match ? match.key : "/";
  }, [location.pathname]);

  const userMenuItems: MenuProps["items"] = [
    {
      key: "profile",
      icon: <UserOutlined />,
      label: "My profile",
      onClick: () => navigate("/profile"),
    },
    { type: "divider" },
    {
      key: "logout",
      icon: <LogoutOutlined />,
      label: "Log out",
      danger: true,
      onClick: () => {
        dispatch(logout());
        navigate("/login", { replace: true });
      },
    },
  ];

  const isMobile = !screens.md;

  return (
    <Layout style={{ minHeight: "100vh", background: "#f3f6fb" }}>
      <Sider
        theme="dark"
        collapsible
        collapsed={collapsed}
        onCollapse={setCollapsed}
        trigger={null}
        breakpoint="md"
        collapsedWidth={isMobile ? 0 : 80}
        width={240}
        style={{
          background: "#0f172a",
          position: "sticky",
          top: 0,
          height: "100vh",
          boxShadow: "18px 0 40px rgba(15, 23, 42, 0.08)",
        }}
      >
        <div className="flex h-20 items-center justify-between gap-2 border-b border-white/10 px-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 text-sm font-bold text-white shadow-lg shadow-blue-500/30">
              PC
            </div>
            {!collapsed && (
              <div>
                <div className="text-sm font-semibold tracking-[0.2em] text-blue-300 uppercase">
                  Pepticanter
                </div>
                <div className="text-xs text-slate-300">Admin Panel</div>
              </div>
            )}
          </div>
        </div>

        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[selectedKey]}
          items={navItems}
          onClick={({ key }) => navigate(key)}
          style={{
            background: "#0f172a",
            borderInlineEnd: "none",
            marginTop: 12,
            padding: "0 10px",
            fontWeight: 600,
          }}
          className="modern-sidebar-menu"
        />
      </Sider>

      <Layout style={{ background: "#f3f6fb" }}>
        <Header
          style={{
            position: "sticky",
            top: 0,
            zIndex: 10,
            padding: "0 22px",
            background: "rgba(255,255,255,0.9)",
            backdropFilter: "blur(10px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderBottom: "1px solid rgba(148, 163, 184, 0.18)",
            boxShadow: "0 8px 18px rgba(15, 23, 42, 0.04)",
          }}
        >
          <div className="flex items-center gap-3">
            <button
              aria-label="Toggle sidebar"
              onClick={() => setCollapsed((c) => !c)}
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-lg text-slate-600 transition hover:border-blue-200 hover:text-blue-600"
            >
              {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            </button>
            <div>
              <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                Overview
              </div>
              <div className="text-sm font-semibold text-slate-700">Operations Center</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button
              type="text"
              shape="circle"
              icon={<BellOutlined className="text-slate-600" />}
              className="flex items-center justify-center bg-white hover:bg-blue-50 hover:text-blue-600"
            />

            <Dropdown menu={{ items: userMenuItems }} trigger={["click"]}>
              <button className="flex items-center gap-3 rounded-full border border-slate-200 bg-white px-2 py-1.5 pr-3 shadow-sm transition hover:border-blue-200 hover:shadow-md">
                <Avatar style={{ backgroundColor: "#2b6cf6" }} icon={<UserOutlined />} />
                {!isMobile && (
                  <div className="text-left leading-tight">
                    <div className="text-sm font-semibold text-slate-800">
                      {name || "Admin"}
                    </div>
                    <Text type="secondary" style={{ fontSize: 11 }}>
                      {role === "SUPER_ADMIN" ? "Super Admin" : "Admin"}
                      {email ? ` · ${email}` : ""}
                    </Text>
                  </div>
                )}
              </button>
            </Dropdown>
          </div>
        </Header>

        <Content style={{ margin: 20, minHeight: 280 }}>
          <div className="dashboard-shell rounded-[24px] p-4 sm:p-5 lg:p-6">
            <Outlet />
          </div>
        </Content>
      </Layout>
    </Layout>
  );
}
