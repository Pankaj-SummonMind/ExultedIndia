import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
// import {BASE_URL} from /

console.log("API URL:", import.meta.env.VITE_API_URL);

export const api = createApi({
  reducerPath: "api",

  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_URL,
  }),     
  
  tagTypes : ["Category","CategoryById","Product","ProductById","User","UserById","SocialMedia","SocialMediaById","Certificate","CertificateById"] ,
  
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

    // social Medial api services

    createSocialMedia : builder.mutation({
        query: (body) => ({
            url:"api/socialMedia/createSocialMedia",
            method:"POST",
            body
        }),
        invalidatesTags: ['SocialMedia'],
    }),

    getAllSocialMedia: builder.query({
        query: () => ({
            url:"api/socialMedia/getAllSocialMedia",
            method:"GET"
        }),
        providesTags: [{type:'SocialMedia'}]
    }),

    getSocialMediaById : builder.query({
        query: (id) => ({
            url:`api/socialMedia/${id}`,
            method:"GET",
        }),
        providesTags:[{type:"SocialMediaById"}]
    }),

    updateSocialMedia : builder.mutation({
        query: (body) => ({
            url:`api/socialMedia/updateSocialMedia`,
            method:"PUT",
            body
        }),
        invalidatesTags:["SocialMedia","SocialMediaById"]
    }),
    
    deleteSocialMedia : builder.mutation({
        query: (body) => ({
            url:`api/socialMedia/deleteSocialMedia`,
            method:"DELETE",
            body
        }),
        invalidatesTags:['SocialMedia']
    }),

    // Certificate api services

    createCertificate : builder.mutation({
        query: (body) => ({
            url:"api/certificate/createCertificate  ",
            method:"POST",
            body
        }),
        invalidatesTags: ['Certificate'],
    }),

    getAllCertificates: builder.query({
        query: () => ({
            url:"api/certificate/getAllCertificates",
            method:"GET"
        }),
        providesTags: [{type:'Certificate'}]
    }),

    getCertificateById : builder.query({
        query: (id) => ({
            url:`api/certificate/getCertificate/${id}`,
            method:"GET",
        }),
        providesTags:[{type:"CertificateById"}]
    }),

    updateCertificate : builder.mutation({
        query: (body) => ({
            url:`api/certificate/updateCertificate`,
            method:"PUT",
            body
        }),
        invalidatesTags:["Certificate","CertificateById"]
    }),
    
    deleteCertificate : builder.mutation({
        query: (id) => ({
            url:`api/certificate/deleteCertificate`,
            method:"DELETE",
        }),
        invalidatesTags:['Certificate']
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
  useGetUserByidQuery,

  // social media
  useCreateSocialMediaMutation,
  useGetAllSocialMediaQuery,
  useGetSocialMediaByIdQuery,
  useDeleteSocialMediaMutation,
  useUpdateSocialMediaMutation,

  // certqificate
    useCreateCertificateMutation,   
    useGetAllCertificatesQuery,
    useDeleteCertificateMutation,
    useUpdateCertificateMutation
} = api;