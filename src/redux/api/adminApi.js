import { tagTypes } from "../tag-types";
import { baseApi } from "./baseApi";

const PAT_URL = "/admin";

export const adminApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getAdmin: build.query({
      query: (id) => ({
        url: `${PAT_URL}/${id}`, // Đảm bảo id là một giá trị chuẩn xác
        method: "GET",
      }),
      providesTags: [tagTypes.admin],
    }),
    updateAdmin: build.mutation({
      query: ({ data, id }) => ({
        url: `${PAT_URL}/${id}`, // Đảm bảo id là một giá trị chuẩn xác
        method: "PATCH",
        data: data,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }),
      invalidatesTags: [tagTypes.admin],
    }),
  }),
});

export const { useGetAdminQuery, useUpdateAdminMutation } = adminApi;
