import { tagTypes } from "../tag-types";
import { baseApi } from "./baseApi";

const ADM_URL = "/admin";

export const adminApi = baseApi.injectEndpoints({
  endpoints: (build) =>({
    getAdmin: build.query({
      query: (id) => ({
        url: `${ADM_URL}/${id}`, // Thêm id vào URL để lấy thông tin của admin cụ thể
        method: "GET",
      }),
      providesTags: [tagTypes.admin],
    }),
    updateAdmin: build.mutation({
      query: ({ data, id }) => ({
        url: `${ADM_URL}/${id}`,
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
