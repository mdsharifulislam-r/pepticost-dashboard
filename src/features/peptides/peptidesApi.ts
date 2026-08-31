import { baseApi } from "@/api/baseApi";
import type { ApiResponse, Peptide, PeptidePayload, QueryParams } from "@/types";

export const peptidesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getPeptides: builder.query<ApiResponse<Peptide[]>, QueryParams>({
      query: (params) => ({
        url: "/peptides",
        params: params ?? undefined,
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.data.map((p) => ({ type: "Peptide" as const, id: p._id })),
              { type: "Peptide" as const, id: "LIST" },
            ]
          : [{ type: "Peptide" as const, id: "LIST" }],
    }),
    createPeptide: builder.mutation<ApiResponse<Peptide>, PeptidePayload>({
      query: (body) => ({
        url: "/peptides",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "Peptide", id: "LIST" }],
    }),
    updatePeptide: builder.mutation<
      ApiResponse<Peptide>,
      { id: string; body: Partial<PeptidePayload> }
    >({
      query: ({ id, body }) => ({
        url: `/peptides/${id}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: (_r, _e, { id }) => [
        { type: "Peptide", id },
        { type: "Peptide", id: "LIST" },
      ],
    }),
    deletePeptide: builder.mutation<ApiResponse<null>, string>({
      query: (id) => ({
        url: `/peptides/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "Peptide", id: "LIST" }],
    }),
  }),
});

export const {
  useGetPeptidesQuery,
  useCreatePeptideMutation,
  useUpdatePeptideMutation,
  useDeletePeptideMutation,
} = peptidesApi;
