import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
// import {BASE_URL} from /

console.log("API URL:", import.meta.env.VITE_API_URL);

export const api = createApi({
  reducerPath: "api",

  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_URL,
  }),     
  
  tagTypes : ["Category","CategoryById","Product","ProductById","User","UserById"] ,
  
  endpoints: (builder) => ({

    // categories api services 

    createCategories : builder.mutation({
        query: (body) => ({
            url:"api/categories/createCategories",
            method:"POST",
            body
        }),
        invalidatesTags: ['Category'],
    }),

    getCategories: builder.query({
        query: () => ({
            url:"api/categories/getCategories",
            method:"GET"
        }),
        providesTags: [{type:'Category'}]
    }),

    updateCategories : builder.mutation({
        query: ({id,...body}) => ({
            url:`api/categories/${id}`,
            method:"PUT",
            body
        }),
        invalidatesTags:["CategoryById","Category"]
    }),

    getCategoriesById : builder.query({
        query: (id) => ({
            url:`api/categories/${id}`,
            method:"GET",
        }),
        providesTags:[{type:"CategoryById"}]
    }), 

    deleteCategories : builder.mutation({
        query: (id) => ({
            url:`api/categories/${id}`,
            method:"DELETE", 
        }),
        invalidatesTags:['Category']
    }),

    // products api servies 

    addProduct : builder.mutation({
        query: (body) => ({
            url:"api/products/createProduct",
            method:"POST",
            body
        }),
        invalidatesTags: ['Product'],
    }),

    getProduct: builder.query({
        query: () => ({
            url:"api/products/getProduct",
            method:"GET"
        }),
        providesTags: [{type:'Product'}]
    }),

    getProductByid : builder.query({
        query: (id) => ({
            url:`api/products/${id}`,
            method:"GET",
        }),
        providesTags:[{type:"ProductById"}]
    }), 

    updateProduct : builder.mutation({
        query: ({id,body}) => ({
            url:`api/products/${id}`,
            method:"PUT",
            body
        }),
        invalidatesTags:["ProductById","Product"]
    }),

    deleteProduct : builder.mutation({
        query: (id) => ({
            url:`api/products/${id}`,
            method:"DELETE", 
        }),
        invalidatesTags:['Product']
    }),


    // users api services 

    registerUser : builder.mutation({
        query: (body) => ({
            url:"api/user/registerUser",
            method:"POST",
            body
        }),
        invalidatesTags: ['User'],
    }),

    getAllUsers: builder.query({
        query: () => ({
            url:"api/user/getAllUsers",
            method:"GET"
        }),
        providesTags: [{type:'User'}]
    }),

    getUserByid : builder.query({
        query: (id) => ({
            url:`api/user/${id}`,
            method:"GET",
        }),
        providesTags:[{type:"UserById"}]
    }),
  })
});

export const {
  useCreateCategoriesMutation,
  useGetCategoriesQuery,
  useGetCategoriesByIdQuery,
  useUpdateCategoriesMutation,
  useDeleteCategoriesMutation,

  // product
  useAddProductMutation,
  useGetProductQuery,
  useGetProductByidQuery,
  useUpdateProductMutation,
  useDeleteProductMutation,

  // user
  useRegisterUserMutation,
  useGetAllUsersQuery,
  useGetUserByidQuery
} = api;