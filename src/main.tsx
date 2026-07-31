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
    colorPrimary: "#0F766E",
    colorInfo: "#0F766E",
    borderRadius: 8,
    fontFamily:
      "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  },
  components: {
    Layout: {
      siderBg: "#0B1120",
      headerBg: "#ffffff",
    },
    Menu: {
      darkItemBg: "#0B1120",
      darkSubMenuItemBg: "#0B1120",
      darkItemSelectedBg: "#0F766E",
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
