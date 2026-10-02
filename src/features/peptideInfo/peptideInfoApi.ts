import { baseApi } from "@/api/baseApi";
import type { ApiResponse, PeptideInfo, QueryParams } from "@/types";

export const peptideInfoApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getPeptideInfos: builder.query<ApiResponse<PeptideInfo[]>, QueryParams>({
      query: (params) => ({
        url: "/peptideInfo",
        params: params ?? undefined,
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.data.map((item) => ({ type: "PeptideInfo" as const, id: item._id })),
              { type: "PeptideInfo" as const, id: "LIST" },
            ]
          : [{ type: "PeptideInfo" as const, id: "LIST" }],
    }),
    getPeptideInfoById: builder.query<ApiResponse<PeptideInfo>, string>({
      query: (id) => `/peptideInfo/${id}`,
      providesTags: (_r, _e, id) => [{ type: "PeptideInfo", id }],
    }),
    createPeptideInfo: builder.mutation<ApiResponse<PeptideInfo>, FormData>({
      query: (formData) => ({
        url: "/peptideInfo",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: [{ type: "PeptideInfo", id: "LIST" }],
    }),
    updatePeptideInfo: builder.mutation<
      ApiResponse<PeptideInfo>,
      { id: string; formData: FormData }
    >({
      query: ({ id, formData }) => ({
        url: `/peptideInfo/${id}`,
        method: "PATCH",
        body: formData,
      }),
      invalidatesTags: (_r, _e, { id }) => [
        { type: "PeptideInfo", id },
        { type: "PeptideInfo", id: "LIST" },
      ],
    }),
    deletePeptideInfo: builder.mutation<ApiResponse<null>, string>({
      query: (id) => ({
        url: `/peptideInfo/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "PeptideInfo", id: "LIST" }],
    }),
  }),
});

export const {
  useGetPeptideInfosQuery,
  useGetPeptideInfoByIdQuery,
  useCreatePeptideInfoMutation,
  useUpdatePeptideInfoMutation,
  useDeletePeptideInfoMutation,
} = peptideInfoApi;
