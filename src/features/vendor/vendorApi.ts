import { baseApi } from "@/api/baseApi";
import type { ApiResponse, QueryParams, Vendor, VendorPayload } from "@/types";

export const vendorApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getVendors: builder.query<ApiResponse<Vendor[]>, QueryParams>({
      query: (params) => ({
        url: "/vendor",
        params: params ?? undefined,
      }),
      providesTags: (result) =>
        result
          ? [
            ...result.data.map((v) => ({ type: "Vendor" as const, id: v._id })),
            { type: "Vendor" as const, id: "LIST" },
          ]
          : [{ type: "Vendor" as const, id: "LIST" }],
    }),
    createVendor: builder.mutation<ApiResponse<Vendor>, VendorPayload>({
      query: (body) => ({
        url: "/vendor",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "Vendor", id: "LIST" }],
    }),
    updateVendor: builder.mutation<
      ApiResponse<Vendor>,
      { id: string; body: Partial<VendorPayload> }
    >({
      query: ({ id, body }) => ({
        url: `/vendor/${id}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: (_r, _e, { id }) => [
        { type: "Vendor", id },
        { type: "Vendor", id: "LIST" },
      ],
    }),
    deleteVendor: builder.mutation<ApiResponse<null>, string>({
      query: (id) => ({
        url: `/vendor/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "Vendor", id: "LIST" }],
    }),
    bulkUploadVendors: builder.mutation<ApiResponse<unknown>, FormData>({
      query: (formData) => ({
        url: "/vendor/bulk-upload",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: [{ type: "Vendor", id: "LIST" }],
    }),
  }),
});

export const {
  useGetVendorsQuery,
  useCreateVendorMutation,
  useUpdateVendorMutation,
  useDeleteVendorMutation,
  useBulkUploadVendorsMutation,
} = vendorApi;
