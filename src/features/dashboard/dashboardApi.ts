import { baseApi } from "@/api/baseApi";
import type { ApiResponse, AdminStats, ApplicationGraphData } from "@/types";

export const dashboardApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAdminStats: builder.query<ApiResponse<AdminStats>, void>({
      query: () => ({
        url: "/admin/stats",
      }),
      providesTags: [
        { type: "Vendor", id: "LIST" },
        { type: "Support", id: "LIST" },
        { type: "Blog", id: "LIST" },
        { type: "Application", id: "LIST" },
      ],
    }),
    getApplicationGraph: builder.query<ApiResponse<ApplicationGraphData>, { year?: number }>({
      query: (params) => ({
        url: "/admin/application-graph",
        params: params ?? undefined,
      }),
      providesTags: [{ type: "Application", id: "LIST" }],
    }),
  }),
});

export const {
  useGetAdminStatsQuery,
  useGetApplicationGraphQuery,
} = dashboardApi;
