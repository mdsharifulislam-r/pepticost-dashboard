import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { ConfigProvider, App as AntApp } from "antd";
import { store } from "@/app/store";
import App from "@/App";
import "@/index.css";

const theme = {
  token: {
    colorPrimary: "#2b6cf6",
    colorInfo: "#2b6cf6",
    colorSuccess: "#16a34a",
    colorWarning: "#f59e0b",
    colorError: "#ef4444",
    borderRadius: 12,
    fontFamily:
      "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  },
  components: {
    Layout: {
      siderBg: "#0f172a",
      headerBg: "#ffffff",
      bodyBg: "#f5f7fb",
      triggerBg: "#eff6ff",
      triggerColor: "#2b6cf6",
    },
    Menu: {
      darkItemBg: "#0f172a",
      darkSubMenuItemBg: "#0f172a",
      darkItemSelectedBg: "#2b6cf6",
      darkItemSelectedColor: "#fff",
      darkItemHoverBg: "rgba(43, 108, 246, 0.16)",
      darkItemColor: "rgba(255,255,255,0.76)",
    },
    Button: {
      borderRadius: 10,
      controlHeight: 38,
    },
    Input: {
      borderRadius: 10,
    },
    Select: {
      borderRadius: 10,
    },
    Table: {
      headerBg: "#f8fafc",
      headerColor: "#475569",
      rowHoverBg: "#fff7ed",
      borderColor: "#e2e8f0",
      colorBgContainer: "#ffffff",
    },
  },
};

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider store={store}>
      <ConfigProvider theme={theme}>
        <AntApp>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </AntApp>
      </ConfigProvider>
    </Provider>
  </StrictMode>
);
