import {ApiError} from "../utils.js/ApiError.js"
import {ApiResponse} from "../utils.js/ApiResponse.js"
import Categories from "../models/categories.modal.js"
import SubCategories from "../models/subCategories.modal.js"


async function createCategories(req,res,next){
    console.log("call api from frontend");
    try {
        const { categories_name, subCategories } = req.body;

        if(!categories_name || !subCategories ){
            throw new ApiError(400,"Category and SubCategory are required")
        }

        // 1. Create subcategories
        const createdSubs = await SubCategories.insertMany(
        subCategories.map(name => ({ name }))
        );

        // 2. Extract IDs
        const subIds = createdSubs.map(sub => sub._id);

        const category = await Categories.create({
            categories_name,
            subCategories: subIds,
        });

        const createdCategory = await Categories.findById(category._id).select("-_id categories_name subCategories")
        console.log("created category: ", createdCategory);

        if(!createdCategory){
            throw new ApiError(500,"somthing went wrong while creating Category")
        }
        
        return res.status(201).json(
            new ApiResponse(200,createdCategory, "category created Successfully")
        )

    } catch (error) {
        console.log("error in creat categories,",error)
        return res.status(error.statusCode).json({
            statusCode: error.statusCode,
            success : error.success,
            message: error.message
            })
    }
}

async function getCategories(req,res,next){
    try {
        const categories = await Categories.find().populate("_id","categories_name","subCategories","-__v -createdAt -updatedAt").select("-__v -createdAt -updatedAt");   
        if(!categories){
            throw new ApiError(404,"No categories found")
        }
        return res.status(200).json(
            new ApiResponse(200,categories,"categories fetched successfully")
        )
    }   catch (error) {
        console.log("error in get categories,",error)
        return res.status(error.statusCode).json({
            statusCode: error.statusCode,
            success : error.success,
            message: error.message
            })
    }
}

async function getCategoryById(req,res,next){
    try {
        const {id} = req.params;
        const category = await Categories.findById(id).populate("_id","categories_name","subCategories","-__v -createdAt -updatedAt").select("-__v -createdAt -updatedAt");
        if(!category){
            throw new ApiError(404,"No category found with this id")
        }
        return res.status(200).json(
            new ApiResponse(200,category,"category fetched successfully")
        )
    }   catch (error) {
        console.log("error in get category by id,",error)
        return res.status(error.statusCode).json({
            statusCode: error.statusCode,
            success : error.success,
            message: error.message
            })
    }
}

async function updateCategory(req,res,next){
    try {
        const {id} = req.params;
        const {categories_name, subCategories} = req.body;
        const category = await Categories.findById(id);
        if(!category){
            throw new ApiError(404,"No category found with this id")
        }
        if(categories_name){
            category.categories_name = categories_name;
        }
        if(subCategories){
            const createdSubs = await SubCategories.insertMany(
                subCategories.map(name => ({ name }))
            );
            const subIds = createdSubs.map(sub => sub._id);
            category.subCategories.push(...subIds);
        }
        await category.save();
        const updatedCategory = await Categories.findById(id).populate("_id","categories_name","subCategories","-__v -createdAt -updatedAt").select("-__v -createdAt -updatedAt");
        return res.status(200).json(
            new ApiResponse(200,updatedCategory,"category updated successfully")
        )
    }   catch (error) {
        console.log("error in update category,",error)
        return res.status(error.statusCode).json({
            statusCode: error.statusCode,
            success : error.success,
            message: error.message
            })
    }
}

async function deleteCategory(req,res,next){
    try {
        const {id} = req.params;
        const category = await Categories.findById(id);
        if(!category){
            throw new ApiError(404,"No category found with this id")
        }
        category.deletedAt = new Date();
        await category.save();
        return res.status(200).json(
            new ApiResponse(200,null,"category deleted successfully")
        )
    }   catch (error) {
        console.log("error in delete category,",error)
        return res.status(error.statusCode).json({
            statusCode: error.statusCode,
            success : error.success,
            message: error.message
            })
    }
}






export {
    createCategories,
    getCategories,
    getCategoryById,
    updateCategory,
    deleteCategory
}