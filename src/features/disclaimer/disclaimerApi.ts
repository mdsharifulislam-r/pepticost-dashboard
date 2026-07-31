import { baseApi } from "@/api/baseApi";
import type { ApiResponse, Disclaimer, DisclaimerPayload, DisclaimerType } from "@/types";

export const disclaimerApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getDisclaimer: builder.query<ApiResponse<Disclaimer>, DisclaimerType>({
      query: (type) => ({
        url: "/disclaimer",
        params: { type },
      }),
      providesTags: (_r, _e, type) => [{ type: "Disclaimer", id: type }],
    }),
    upsertDisclaimer: builder.mutation<ApiResponse<Disclaimer>, DisclaimerPayload>({
      query: (body) => ({
        url: "/disclaimer",
        method: "POST",
        body,
      }),
      invalidatesTags: (_r, _e, body) => [{ type: "Disclaimer", id: body.type }],
    }),
  }),
});

export const { useGetDisclaimerQuery, useUpsertDisclaimerMutation } = disclaimerApi;
