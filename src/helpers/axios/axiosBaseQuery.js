import { instance } from './axiosInstance';


export const axiosBaseQuery =
    ({ baseUrl } = { baseUrl: '' }) =>
        async ({ url, method, data, params, headers }) => {
            try {
                console.log("base url: " + baseUrl)
                console.log("url: " + url)
                console.log("method: " + method)
                console.log("data: ", data)
                console.log("params: ", params)
                console.log("headers: ", headers)
                const result = await instance({
                    url: baseUrl + url,
                    method,
                    data,
                    params,
                    headers: headers
                })
                
                return { data: result.data }
            } catch (axiosError) {
                const err = axiosError
                return {
                    error: {
                        status: err.response?.status,
                        data: err.response?.data || err.message,
                    },
                }
            }
        }


