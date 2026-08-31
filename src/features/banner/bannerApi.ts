import { baseApi } from "@/api/baseApi";
import type { ApiResponse, Banner, QueryParams } from "@/types";

export const bannerApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getBanners: builder.query<ApiResponse<Banner[]>, QueryParams>({
      query: (params) => ({
        url: "/banner",
        params: params ?? undefined,
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.data.map((b) => ({ type: "Banner" as const, id: b._id })),
              { type: "Banner" as const, id: "LIST" },
            ]
          : [{ type: "Banner" as const, id: "LIST" }],
    }),
    getBannerById: builder.query<ApiResponse<Banner>, string>({
      query: (id) => `/banner/${id}`,
      providesTags: (_r, _e, id) => [{ type: "Banner", id }],
    }),
    createBanner: builder.mutation<ApiResponse<Banner>, FormData>({
      query: (formData) => ({
        url: "/banner",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: [{ type: "Banner", id: "LIST" }],
    }),
    updateBanner: builder.mutation<ApiResponse<Banner>, { id: string; formData: FormData }>({
      query: ({ id, formData }) => ({
        url: `/banner/${id}`,
        method: "PATCH",
        body: formData,
      }),
      invalidatesTags: (_r, _e, { id }) => [
        { type: "Banner", id },
        { type: "Banner", id: "LIST" },
      ],
    }),
    deleteBanner: builder.mutation<ApiResponse<null>, string>({
      query: (id) => ({
        url: `/banner/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "Banner", id: "LIST" }],
    }),
  }),
});

export const {
  useGetBannersQuery,
  useGetBannerByIdQuery,
  useCreateBannerMutation,
  useUpdateBannerMutation,
  useDeleteBannerMutation,
} = bannerApi;
