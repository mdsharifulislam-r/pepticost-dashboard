import { baseApi } from "@/api/baseApi";
import type { ApiResponse, Faq, FaqPayload, QueryParams } from "@/types";

export const faqApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getFaqs: builder.query<ApiResponse<Faq[]>, QueryParams | void>({
      query: (params) => ({
        url: "/faq",
        params: params ?? undefined,
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.data.map((f) => ({ type: "Faq" as const, id: f._id })),
              { type: "Faq" as const, id: "LIST" },
            ]
          : [{ type: "Faq" as const, id: "LIST" }],
    }),
    createFaq: builder.mutation<ApiResponse<Faq>, FaqPayload>({
      query: (body) => ({
        url: "/faq",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "Faq", id: "LIST" }],
    }),
    updateFaq: builder.mutation<
      ApiResponse<Faq>,
      { id: string; body: Partial<FaqPayload> }
    >({
      query: ({ id, body }) => ({
        url: `/faq/${id}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: (_r, _e, { id }) => [
        { type: "Faq", id },
        { type: "Faq", id: "LIST" },
      ],
    }),
    deleteFaq: builder.mutation<ApiResponse<null>, string>({
      query: (id) => ({
        url: `/faq/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "Faq", id: "LIST" }],
    }),
  }),
});

export const {
  useGetFaqsQuery,
  useCreateFaqMutation,
  useUpdateFaqMutation,
  useDeleteFaqMutation,
} = faqApi;
