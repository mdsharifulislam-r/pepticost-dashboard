import { useMemo, useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { Layout, Menu, Avatar, Dropdown, Typography, Grid } from "antd";
import type { MenuProps } from "antd";
import {
  DashboardOutlined,
  ExperimentOutlined,
  ShopOutlined,
  FileTextOutlined,
  QuestionCircleOutlined,
  FileProtectOutlined,
  PictureOutlined,
  CustomerServiceOutlined,
  FormOutlined,
  UserOutlined,
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
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
    <Layout style={{ minHeight: "100vh" }}>
      <Sider
        theme="dark"
        collapsible
        collapsed={collapsed}
        onCollapse={setCollapsed}
        trigger={null}
        breakpoint="md"
        collapsedWidth={isMobile ? 0 : 80}
        style={{ background: "#0B1120" }}
      >
        <div className="flex h-16 items-center justify-center gap-2 px-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal-600 text-sm font-bold text-white">
            PC
          </div>
          {!collapsed && (
            <span className="text-base font-semibold tracking-wide text-white">
              Pepticost
            </span>
          )}
        </div>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[selectedKey]}
          items={navItems}
          onClick={({ key }) => navigate(key)}
          style={{ background: "#0B1120", borderInlineEnd: "none" }}
        />
      </Sider>

      <Layout>
        <Header
          style={{
            padding: "0 20px",
            background: "#fff",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderBottom: "1px solid #eef0f2",
          }}
        >
          <button
            aria-label="Toggle sidebar"
            onClick={() => setCollapsed((c) => !c)}
            className="flex h-9 w-9 items-center justify-center rounded-md text-lg text-slate-600 hover:bg-slate-100"
          >
            {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          </button>

          <Dropdown menu={{ items: userMenuItems }} trigger={["click"]}>
            <button className="flex items-center gap-2 rounded-full px-2 py-1 hover:bg-slate-100">
              <Avatar style={{ backgroundColor: "#0F766E" }} icon={<UserOutlined />} />
              {!isMobile && (
                <div className="text-left leading-tight">
                  <div className="text-sm font-medium text-slate-800">
                    {name || "Admin"}
                  </div>
                  <Text type="secondary" style={{ fontSize: 12 }}>
                    {role === "SUPER_ADMIN" ? "Super Admin" : "Admin"}
                    {email ? ` · ${email}` : ""}
                  </Text>
                </div>
              )}
            </button>
          </Dropdown>
        </Header>

        <Content style={{ margin: "20px", minHeight: 280 }}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
}
