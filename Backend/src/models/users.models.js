import mongoose,{Schema} from "mongoose";

const userSchema = new Schema({
    name:{
        type:String,
        require:true,
        trim:true,
    },
    mobileNumber:{
        type: Number,
        require: true,
    },
    email:{
        type:String,
        default:null,
    },
    message:{
        type:String,
        trim:true
    }
})

const User = mongoose.model("User",userSchema);

export default User;