import {Schema,model} from 'mongoose'


const jobSchema=new Schema({
jobTitle:{
    type:String,
    required:true,
},
jobLocation:{
    type:String, 
    enum:['onsite', 'remotely', 'hybrid'],
    default:'onsite'

},
workingTime:{
    type:String,
    enum:['part-time' , 'full-time'],
    default:'part-time'
},
seniorityLevel:{
    type:String,
    enum:['Junior', 'Mid-Level', 'Senior','Team-Lead', 'CTO'],
    default:'Junior'
},
jobDescription:{
    type:String
},
technicalSkills:{
    type:[String]
},
softSkills:{
    type:[String]
},
addedBy:{
    type:Schema.Types.ObjectId,
    ref:'User'
}

},{timestamps:true})


const job=model('job',jobSchema)


export default job