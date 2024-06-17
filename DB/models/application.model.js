import  { Schema,model} from "mongoose";


const applicationSchema = new Schema({
 jobId:{
    type:Schema.Types.ObjectId,
    ref:'job',
    required:true
 },
 userId:{
    type:Schema.Types.ObjectId,
    ref:'User',
    required:true
 },
 userTechSkills:{
    type:[String]
 },
 userSoftSkills:{
    type:[String]
 },
 userResume:{
   secure_url:{type:String,required:true},
   public_id:{type:String,required:true,unique:true}
 }

},{timestamps:true})


const application=model('application',applicationSchema)

export default application