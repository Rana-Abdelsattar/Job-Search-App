import joi from 'joi'
import { Types } from 'mongoose'

// ====custom validation for objectId

const objectIdValidation=(value,helper)=>{

    const isValid=Types.ObjectId.isValid(value)
    return(isValid ? value : helper.message('invalid id'))

}

// ========add company schema

export const addCompanySchema={
    body:joi.object({
        companyName:joi.string().required(),
        description:joi.string(),
        industry:joi.string(),
        address:joi.string(),
        minNumberOfEmployee:joi.number().positive().required(),
        maxNumberOfEmployee:joi.number().positive().required(),
        companyEmail:joi.string().email().required()
    }),
    headers:joi.object({
        token:joi.string().required()
    }).options({allowUnknown:true})
}

// ==============updateCompanyData schema


export const updateCompanySchema={
    body:joi.object({
        companyName:joi.string(),
        description:joi.string(),
        industry:joi.string(),
        address:joi.string(),
        minNumberOfEmployee:joi.number().positive(),
        maxNumberOfEmployee:joi.number().positive(),
        companyEmail:joi.string().email()
    }),
    headers:joi.object({
        token:joi.string().required()
    }).options({allowUnknown:true}),
    query:joi.object({
        companyId:joi.string().custom(objectIdValidation).required()
    })
}

// ==============deleteCompany schema

export const deleteCompanySchema={
    headers:joi.object({
        token:joi.string().required()
    }).options({allowUnknown:true}),
    query:joi.object({
        companyId:joi.string().custom(objectIdValidation).required()
    })
}
// =================Get company data With its Jobs schema

export const getCompanyData={
    headers:joi.object({
        token:joi.string().required()
    }).options({allowUnknown:true}),
    query:joi.object({
        companyId:joi.string().custom(objectIdValidation).required()
    })

}


// ============search for company with name Schema

export const searchCompanySchema={
    params:joi.object({
        name:joi.string().required()
    })
}

// ============================= 6-Get all applications for specific Jobs  schema

   export const applicationForSpecificJob={
    query:joi.object({
        companyId:joi.string().custom(objectIdValidation).required(),
        jobId:joi.string().custom(objectIdValidation).required(),
    }),
    headers:joi.object({
        token:joi.string().required()
    }).options({allowUnknown:true})


   }