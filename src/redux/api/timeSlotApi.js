import { tagTypes } from "../tag-types";
import { baseApi } from "./baseApi"

const TIMELOT_URL = '/timeslot'

export const timeSlotApi = baseApi.injectEndpoints({
    endpoints: (build) => ({
        createTimeSlot: build.mutation({
            query: (data) => ({
                url: `${TIMELOT_URL}/create`,
                method: 'POST',
                data, //truyền data chứ không vào body
            }),
            invalidatesTags: [tagTypes.timeSlot]
        }),
        getAllTimeSlot: build.query({
            query: () => ({
                url: `${TIMELOT_URL}/`,
                method: 'GET'
            }),
            providesTags: [tagTypes.timeSlot]
        }),
        getTimeSlot: build.query({
            query: (id) => ({
                url: `${TIMELOT_URL}/${id}`,
                method: 'GET'
            }),
            providesTags: (result, error, id) => [{ type: tagTypes.timeSlot, id }]
        }),
        getAppointmentTime: build.query({
            query: ({ day, id }) => ({
                url: `${TIMELOT_URL}/appointment-time/${id}`,
                method: 'GET',
                params: {day:day}
            }
            ),
            providesTags: [tagTypes.timeSlot]
        }),
        getDoctorTimeSlot: build.query({
            query: (arg) => ({
                url: `${TIMELOT_URL}/my-slot`,
                method: 'GET',
                params: arg
            }),
            providesTags: [tagTypes.timeSlot]
        }),
        deleteTimeSlot: build.mutation({
            query: (id) => {
                console.log("id", id)
                return {
                    url: `${TIMELOT_URL}/`,
                    method: 'DELETE',
                    data: id
                }
               
            },
            invalidatesTags: [tagTypes.timeSlot]
        }),
        UpdateTimeSlot: build.mutation({
            query: (data) => ({
                url: `${TIMELOT_URL}`,
                method: 'PATCH',
                data: data
            }),
            invalidatesTags: [tagTypes.timeSlot]
        }),
    })
})

export const {
    useCreateTimeSlotMutation,
    useGetAllTimeSlotQuery,
    useDeleteTimeSlotMutation,
    useGetDoctorTimeSlotQuery,
    useGetTimeSlotQuery,
    useGetAppointmentTimeQuery,
    useUpdateTimeSlotMutation
} = timeSlotApi;