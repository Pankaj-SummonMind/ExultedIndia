import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
// import {BASE_URL} from /

console.log("API URL:", import.meta.env.VITE_API_URL);

export const api = createApi({
  reducerPath: "api",

  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_URL,
  }),     
  
  tagTypes : ["Category","CategoryById","SubCategory","SubCategoryById","Product","ProductById","User","UserById","SocialMedia","SocialMediaById","Certificate","CertificateById","HomePage","AboutUs"] ,
  
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
        query: ({id,body}) => ({
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

    // sub categories api services

    createSubCategories : builder.mutation({
        query: (body) => ({
            url:"api/subCategories/createSubCategories",
            method:"POST",
            body
        }),
        invalidatesTags:["SubCategory"],
    }),

    getSubCategories: builder.query({
        query: () => ({
            url:"api/subCategories/getSubCategories",
            method:"GET"
        }),
        providesTags:[{type:"SubCategory"}]
    }),

    updateSubCategories : builder.mutation({
        query: ({id, body}) => ({
            url:`api/subCategories/${id}`,
            method:"PUT",
            body
        }),
        invalidatesTags:["SubCategory","SubCategoryById"]
    }),

    getSubCategoryById : builder.query({
        query: (id) => ({
            url:`api/subCategories/${id}`,
            method:"GET",
        }),
        providesTags:[{type:"SubCategoryById"}]
    }),

    deleteSubCategories : builder.mutation({
        query: (id) => ({
            url:`api/subCategories/${id}`,
            method:"DELETE",
        }),
        invalidatesTags:["SubCategory"]
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
        query: (body) => ({
            url:`api/certificate/deleteCertificate`,
            method:"DELETE",
            body
        }),
        invalidatesTags:['Certificate']
    }),

    // Certificate api services

    createHomePage : builder.mutation({
        query: (body) => ({
            url:"api/homepage/createHomePage  ",
            method:"POST",
            body
        }),
        invalidatesTags: ['HomePage'],
    }),

    getHomePage: builder.query({
        query: () => ({
            url:"api/homepage/getHomePage",
            method:"GET"
        }),
        providesTags: [{type:'HomePage'}]
    }),

    updateHomePage : builder.mutation({
        query: (body) => ({
            url:`api/homepage/updateHomePage`,
            method:"PUT",
            body
        }),
        invalidatesTags:["HomePage"]
    }),

    // AboutUs api services

    createAboutUs : builder.mutation({
        query: (body) => ({
            url:"api/aboutus/createAboutUs",
            method:"POST",
            body
        }),
        invalidatesTags: ["AboutUs"],
    }),

    getAboutUs: builder.query({
        query: () => ({
            url:"api/aboutus/getAboutUs",
            method:"GET"
        }),
        providesTags: [{type:"AboutUs"}]
    }),

    updateAboutUs : builder.mutation({
        query: (body) => ({
            url:"api/aboutus/updateAboutUs",
            method:"PUT",
            body
        }),
        invalidatesTags:["AboutUs"]
    }),


  })
});

export const {
  useCreateCategoriesMutation,
  useGetCategoriesQuery,
  useGetCategoriesByIdQuery,
  useUpdateCategoriesMutation,
  useDeleteCategoriesMutation,

  // sub category
  useCreateSubCategoriesMutation,
  useGetSubCategoriesQuery,
  useUpdateSubCategoriesMutation,
  useGetSubCategoryByIdQuery,
  useDeleteSubCategoriesMutation,

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
    useUpdateCertificateMutation,

  // HomePage
    useGetHomePageQuery,
    useCreateHomePageMutation,
    useUpdateHomePageMutation,

  // AboutUs
    useGetAboutUsQuery,
    useCreateAboutUsMutation,
    useUpdateAboutUsMutation,

} = api;
