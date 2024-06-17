import job from '../../../DB/models/job.model.js'
import company from '../../../DB/models/Company.model.js'
import application from '../../../DB/models/application.model.js'
import clodinaryConnection from '../../Utils/cloudinary.js'




// ================= 1- Add job===================
export const addJob=async(req,res,next)=>{
    const{jobTitle,jobLocation,workingTime,seniorityLevel,jobDescription,technicalSkills,softSkills}=req.body
    const{_id}=req.authUser;

const createdJob=await job.create({jobTitle,jobLocation,workingTime,seniorityLevel,jobDescription,technicalSkills,softSkills,addedBy:_id}) 
  if(!createdJob) return next(new Error('job creation failed'),{cause:400})

  res.status(200).json({message:"job added successfully",jobData:createdJob})
}

// =================2-update job ================

export const updateJob=async(req,res,next)=>{
    const{jobTitle,jobLocation,workingTime,seniorityLevel,jobDescription,technicalSkills,softSkills}=req.body
    const{_id}=req.authUser
    const{jobId}=req.query
    
    
    const updatedJob=await job.findOneAndUpdate({_id:jobId,addedBy:_id},{jobTitle,jobLocation,workingTime,seniorityLevel,jobDescription,technicalSkills,softSkills},{new:true})

    if(!updatedJob) return next(new Error('updated fail'),{cause:400})
    res.status(200).json({message:"job updated successfully",updatedJob})

}

    
   
// ======================= 3- delete job================

export const deleteJob=async(req,res,next)=>{
const{jobId}=req.query;
    const{_id}=req.authUser
    
    const deletedJob=await job.findOneAndDelete({_id:jobId,addedBy:_id})
     if(!deletedJob) return next(new Error('Deleting job fail'),{cause:400})

     res.status(200).json({message:"Job deleted successfully"})
    }



    // search for all jobs
    // loop for each job to add new key named realatedCompany
    // search for company that his companyHr add this job
    // add this new key for the returned job

    //  ==================  4- Get all Jobs with their company’s information==========================

   export const getAllJobsWithCompanyInfo=async(_,res,next)=>{
    
    const jobs=await job.find().lean()
    if(!jobs.length) return next(new Error('No Jobs found'),{cause:204})
    for (const job of jobs) {
        const companyFound=await company.findOne({companyHR:job.addedBy})
        job.relatedToCompany=companyFound
    }
   
    
    res.status(200).json({message:"Done",AllJob:jobs})
}


// =======================5- Get all Jobs for a specific company.

export const getAlljobsforSpecificCompany=async(req,res,next)=>{

    const{companyName}=req.query

    const isComapanyFound=await company.findOne({companyName})

    if(!isComapanyFound) return next(new Error('company not found'),{cause:204})

   const jobs=await job.find({addedBy:isComapanyFound.companyHR})
  if(!jobs.length) return next(new Error('there is no jobs for this company'),{cause:204})

  res.status(200).json({message:"success",AllJobsForThisCompany:jobs})
}

// ======================= 6- Get all Jobs that match the following filters

export const getAllJobsThatMatchFilter=async(req,res,next)=>{

    const{jobTitle,jobLocation,workingTime,seniorityLevel,technicalSkills}=req.body;

    const jobs=await job.find({
        $or:[
            {jobTitle},
            { jobLocation },
            {workingTime},
            {seniorityLevel},
            {technicalSkills}
        ]
    })

    if(!jobs.length) return next(new Error('No jobs matched'),{cause:204})

    res.status(200).json({message:'success',JobMatched:jobs})
}

// ====================7- Apply to Job


export const applyToJob=async(req,res,next)=>{
    const{userTechSkills,userSoftSkills}=req.body;
    const{jobId}=req.query;
    const{_id}=req.authUser

    if(!req.file) return next(new Error('please upload your file'),{cause:400})

    const {secure_url,public_id}=await clodinaryConnection().uploader.upload(req.file.path,{folder:`UserResume/${_id}`,resource_type:'auto',use_filename:true})


    const createdapplication=await application.create({
        userTechSkills,
        userSoftSkills,
        userId:_id,
        jobId,
        userResume:{secure_url,public_id}})
    if(!createdapplication) return next(new Error('creation fail'))
   
    res.status(200).json({message:'application created successfully',createdapplication})
    


}