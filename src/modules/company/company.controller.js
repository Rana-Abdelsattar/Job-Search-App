import company from '../../../DB/models/Company.model.js'
import job from '../../../DB/models/job.model.js'
import application from '../../../DB/models/application.model.js'




// recieve data from user
// check if companyName and companyEmail are not already existing 
// if not exists create new company
// =================== 1- Add Company =================
export const addCompany=async(req,res,next)=>{
const{companyName,description,industry,address,minNumberOfEmployee,maxNumberOfEmployee,companyEmail}=req.body
const{_id}=req.authUser;

    // check if company name and Email already exist

    const isCompanyNameExists=await company.findOne({companyName})
    if(isCompanyNameExists) return next(new Error('company name already exists',{cause:409}))

    const isCompanyEmailExists=await company.findOne({companyEmail})
    if(isCompanyEmailExists) return next(new Error('company Email already exists',{cause:409}))

    const createdCompany=await company.create({companyName,description,industry, address,numberOfEmployees:minNumberOfEmployee+"-"+maxNumberOfEmployee,companyEmail,companyHR:_id})
    if(!createdCompany) return next(new Error('company not created',{cause:400}))

    res.status(200).json({message:"company created successfully",createdCompany})


}
// recieve new data from user
// check if this user is the owner of company and already logged in
// check if company name and email are already existing
// if not existing update the data 

// ================ 2-updata Company Data======================

export const updateCompanyData= async (req,res,next)=>{
    const{companyName,description,industry,address,numberOfEmployees,companyEmail}=req.body
    const{_id}=req.authUser;
    const{companyId}=req.query;

      // check if company name and Email already exist
    const isCompanyNameExists=await company.findOne({companyName})
    if(isCompanyNameExists) return next(new Error('company name already exists',{cause:409}))

    const isCompanyEmailExists=await company.findOne({companyEmail})
    if(isCompanyEmailExists) return next(new Error('company Email already exists',{cause:409}))

    // update data

    const updatedCompany=await company.findOneAndUpdate({_id:companyId,companyHR:_id},{companyName,description,industry,address,numberOfEmployees,companyEmail},{new:true})
     if(!updatedCompany) return next(new Error('updated fail'))

     res.status(200).json({message:'updated successfully',updatedCompany})


}

// ==========================3- delete company=======================
 export const deleteCompany=async(req,res,next)=>{
    const{_id}=req.authUser;
    const{companyId}=req.query;

    const deletedCompany=await company.findOneAndDelete({_id:companyId,companyHR:_id})
     if(!deletedCompany) return next(new Error('Deleting Company fail'),{cause:400})

     res.status(200).json({message:"company deleted successfully"})
 }


// recieve companyId from user
// search for company by id 
// search in job collection which addedby companyHr 
// use lean to convert  from BSON to object to add new key
// return company with its jobs
//  ========================4- Get company data With its Jobs ========================
export const getCompanyData=async(req,res,next)=>{
     const{companyId}=req.query
     const{_id}=req.authUser

      const CompanyFound= await company.findOne({_id:companyId,companyHR:_id}).lean();
      if(!CompanyFound) return next(new Error('company not found',{cause:404}))

      const jobs=await job.find({addedBy:CompanyFound.companyHR})
      CompanyFound.Jobs=jobs

      res.status(200).json({message:"Done",CompanyFound})
}


//  ========================5-search for company with name===================

    export const searchForCompany=async (req,res,next)=>{
        const{name}=req.params;
        const isCompanyExist=await company.findOne({companyName:name});
        if(!isCompanyExist) return next(new Error('company not found',{cause:404}))

        res.status(200).json({message:"Done",CompanyData:isCompanyExist})
    }


    // ============================= 6-Get all applications for specific Jobs 

export const getAllAplicationsForSpecificJob = async(req,res,next)=>{
    const{companyId,jobId}=req.query;
    const{_id}=req.authUser;

   const specificCompany=await company.findOne({_id:companyId,companyHR:_id}).lean()
   if(!specificCompany) return next(new Error('company not found',{cause:404}))


   const specificJob= await job.findOne({_id:jobId,addedBy:specificCompany.companyHR}).lean()

   const applications= await application.find({jobId:jobId})
   .populate(
    {path:'userId',
     select:'-_id -password'})
   specificJob.Allapplications=applications
   specificCompany.job=specificJob

   res.status(200).json({message:"success",specificJob})
   
}





 
