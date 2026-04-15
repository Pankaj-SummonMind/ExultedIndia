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

export {
    createCategories,
}