import { baseApi } from "@/api/baseApi";
import type { ApiResponse, Blog, QueryParams } from "@/types";

export const blogApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getBlogs: builder.query<ApiResponse<Blog[]>, QueryParams>({
      query: (params) => ({
        url: "/blog",
        params: params ?? undefined,
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.data.map((b) => ({ type: "Blog" as const, id: b._id })),
              { type: "Blog" as const, id: "LIST" },
            ]
          : [{ type: "Blog" as const, id: "LIST" }],
    }),
    getBlogById: builder.query<ApiResponse<Blog>, string>({
      query: (id) => `/blog/${id}`,
      providesTags: (_r, _e, id) => [{ type: "Blog", id }],
    }),
    createBlog: builder.mutation<ApiResponse<Blog>, FormData>({
      query: (formData) => ({
        url: "/blog",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: [{ type: "Blog", id: "LIST" }],
    }),
    updateBlog: builder.mutation<ApiResponse<Blog>, { id: string; formData: FormData }>({
      query: ({ id, formData }) => ({
        url: `/blog/${id}`,
        method: "PATCH",
        body: formData,
      }),
      invalidatesTags: (_r, _e, { id }) => [
        { type: "Blog", id },
        { type: "Blog", id: "LIST" },
      ],
    }),
    deleteBlog: builder.mutation<ApiResponse<null>, string>({
      query: (id) => ({
        url: `/blog/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "Blog", id: "LIST" }],
    }),
  }),
});

export const {
  useGetBlogsQuery,
  useGetBlogByIdQuery,
  useCreateBlogMutation,
  useUpdateBlogMutation,
  useDeleteBlogMutation,
} = blogApi;
