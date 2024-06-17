import  { Schema,model} from "mongoose";
import { systemRoles } from "../../src/Utils/systemRoles.js";

const userSchema=new Schema({
firstName:{
    type:String,
    min:3,
    max:15,
    required:true
},
lastName:{
    type:String,
    min:3,
    max:15,
    required:true
},
userName:{
   type:String
},
email:{
    type:String,
    required:true,
    unique:true
},
password:{
    type:String,
    required:true

},
recoveryEmail:{
    type:String,
    required:true
},
DOB:{
    type:Date
},
mobileNumber:{
    type:String,
    required:true,
    unique:true
},
role:{
    type:String,
    enum:[systemRoles.USER, systemRoles.CompanyHR],
    default:systemRoles.USER
},
status:{
    type:String,
    enum:['online','offline'],
    default:'offline'
},

},{timestamps:true})


const User=model('User',userSchema)

export default User