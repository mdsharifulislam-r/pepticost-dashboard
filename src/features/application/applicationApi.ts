import { baseApi } from "@/api/baseApi";
import type {
  ApiResponse,
  Application,
  ApplicationStatusPayload,
  QueryParams,
} from "@/types";

export const applicationApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getApplications: builder.query<ApiResponse<Application[]>, QueryParams | void>({
      query: (params) => ({
        url: "/application",
        params: params ?? undefined,
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.data.map((a) => ({ type: "Application" as const, id: a._id })),
              { type: "Application" as const, id: "LIST" },
            ]
          : [{ type: "Application" as const, id: "LIST" }],
    }),
    getApplicationById: builder.query<ApiResponse<Application>, string>({
      query: (id) => `/application/${id}`,
      providesTags: (_r, _e, id) => [{ type: "Application", id }],
    }),
    updateApplicationStatus: builder.mutation<
      ApiResponse<Application>,
      { id: string; payload: ApplicationStatusPayload }
    >({
      query: ({ id, payload }) => ({
        url: `/application/${id}`,
        method: "PATCH",
        body: payload,
      }),
      invalidatesTags: (_r, _e, { id }) => [
        { type: "Application", id },
        { type: "Application", id: "LIST" },
      ],
    }),
  }),
});

export const {
  useGetApplicationsQuery,
  useGetApplicationByIdQuery,
  useUpdateApplicationStatusMutation,
} = applicationApi;
