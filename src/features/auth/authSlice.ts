import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { UserRole } from "@/types";

export interface AuthState {
  token: string | null;
  role: UserRole | null;
  name: string | null;
  email: string | null;
}

const initialState: AuthState = {
  token: localStorage.getItem("pepticost_token"),
  role: (localStorage.getItem("pepticost_role") as UserRole | null) ?? null,
  name: localStorage.getItem("pepticost_name"),
  email: localStorage.getItem("pepticost_email"),
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{
        token: string;
        role: UserRole;
        name?: string;
        email?: string;
      }>
    ) => {
      const { token, role, name, email } = action.payload;
      state.token = token;
      state.role = role;
      state.name = name ?? state.name;
      state.email = email ?? state.email;

      localStorage.setItem("pepticost_token", token);
      localStorage.setItem("pepticost_role", role);
      if (name) localStorage.setItem("pepticost_name", name);
      if (email) localStorage.setItem("pepticost_email", email);
    },
    updateUserInfo: (
      state,
      action: PayloadAction<{ name?: string; email?: string }>
    ) => {
      const { name, email } = action.payload;
      if (name) {
        state.name = name;
        localStorage.setItem("pepticost_name", name);
      }
      if (email) {
        state.email = email;
        localStorage.setItem("pepticost_email", email);
      }
    },
    logout: (state) => {
      state.token = null;
      state.role = null;
      state.name = null;
      state.email = null;

      localStorage.removeItem("pepticost_token");
      localStorage.removeItem("pepticost_role");
      localStorage.removeItem("pepticost_name");
      localStorage.removeItem("pepticost_email");
    },
  },
});

export const { setCredentials, updateUserInfo, logout } = authSlice.actions;
export default authSlice.reducer;
