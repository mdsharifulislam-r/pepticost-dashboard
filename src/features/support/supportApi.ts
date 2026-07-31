import { baseApi } from "@/api/baseApi";
import type { ApiResponse, Support, SupportReplyPayload, QueryParams } from "@/types";

export const supportApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getSupportMessages: builder.query<ApiResponse<Support[]>, QueryParams | void>({
      query: (params) => ({
        url: "/support",
        params: params ?? undefined,
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.data.map((s) => ({ type: "Support" as const, id: s._id })),
              { type: "Support" as const, id: "LIST" },
            ]
          : [{ type: "Support" as const, id: "LIST" }],
    }),
    getSupportMessageById: builder.query<ApiResponse<Support>, string>({
      query: (id) => `/support/${id}`,
      providesTags: (_r, _e, id) => [{ type: "Support", id }],
    }),
    replySupportMessage: builder.mutation<
      ApiResponse<Support>,
      { id: string; payload: SupportReplyPayload }
    >({
      query: ({ id, payload }) => ({
        url: `/support/${id}`,
        method: "PATCH",
        body: {
          message: payload.reply,
        },
      }),
      invalidatesTags: (_r, _e, { id }) => [
        { type: "Support", id },
        { type: "Support", id: "LIST" },
      ],
    }),
    deleteSupportMessage: builder.mutation<ApiResponse<null>, string>({
      query: (id) => ({
        url: `/support/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "Support", id: "LIST" }],
    }),
  }),
});

export const {
  useGetSupportMessagesQuery,
  useGetSupportMessageByIdQuery,
  useReplySupportMessageMutation,
  useDeleteSupportMessageMutation,
} = supportApi;
