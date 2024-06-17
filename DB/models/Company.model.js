
import  { Schema,model} from "mongoose";


const companySchema = new Schema({
    companyName:{
        type:String,
        unique:true,
        required:true
    },
    description:{
        type:String
    },
    industry:{
      type:String
    },
    address:{
     type:String
    },
    numberOfEmployees:{
        type:String,
        required:true
    },
    companyEmail:{
        type:String,
        unique:true,
        required:true

    },
    companyHR:{
        type: Schema.Types.ObjectId,
        ref:'User'
    }

},{timestamps:true})


const company=model('company',companySchema)

export default company