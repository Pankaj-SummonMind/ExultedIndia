import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
// import {BASE_URL} from /

console.log("API URL:", import.meta.env.VITE_API_URL);

export const api = createApi({
  reducerPath: "api",

  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_URL,
  }),                       
  
  endpoints: (builder) => ({
    createCategories : builder.mutation({
        query: (body) => ({
            url:"api/categories/createCategories",
            method:"POST",
            body
        })
    }),

  })
});

export const {
  useCreateCategoriesMutation
} = api;