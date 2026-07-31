import { baseApi } from "@/api/baseApi";
import type {
  ApiResponse,
  AuthUser,
  ChangePasswordPayload,
  ForgotPasswordPayload,
  LoginPayload,
  Profile,
  ResetPasswordPayload,
  VerifyOtpPayload,
  VerifyOtpResult,
} from "@/types";

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<ApiResponse<AuthUser>, LoginPayload>({
      query: (body) => ({
        url: "/auth/login",
        method: "POST",
        body,
      }),
    }),
    forgotPassword: builder.mutation<ApiResponse<null>, ForgotPasswordPayload>({
      query: (body) => ({
        url: "/auth/forgot-password",
        method: "POST",
        body,
      }),
    }),
    verifyOtp: builder.mutation<ApiResponse<VerifyOtpResult>, VerifyOtpPayload>({
      query: (body) => ({
        url: "/auth/verify-otp",
        method: "POST",
        body,
      }),
    }),
    resetPassword: builder.mutation<
      ApiResponse<null>,
      ResetPasswordPayload & { resetToken: string }
    >({
      query: ({ resetToken, ...body }) => ({
        url: "/auth/reset-password",
        method: "POST",
        body,
        headers: { Authorization: resetToken },
      }),
    }),
    changePassword: builder.mutation<ApiResponse<null>, ChangePasswordPayload>({
      query: (body) => ({
        url: "/auth/change-password",
        method: "POST",
        body,
      }),
    }),
    getProfile: builder.query<ApiResponse<Profile>, void>({
      query: () => "/user/profile",
      providesTags: ["Profile"],
    }),
    updateProfile: builder.mutation<ApiResponse<Profile>, FormData>({
      query: (formData) => ({
        url: "/user/profile",
        method: "PATCH",
        body: formData,
      }),
      invalidatesTags: ["Profile"],
    }),
  }),
});

export const {
  useLoginMutation,
  useForgotPasswordMutation,
  useVerifyOtpMutation,
  useResetPasswordMutation,
  useChangePasswordMutation,
  useGetProfileQuery,
  useUpdateProfileMutation,
} = authApi;
