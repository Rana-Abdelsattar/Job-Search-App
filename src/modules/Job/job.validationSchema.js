

import joi from 'joi'
import {Types} from 'mongoose'

// ====custom validation for objectId

const objectIdValidation=(value,helper)=>{

    const isValid=Types.ObjectId.isValid(value)
    return(isValid ? value : helper.message('invalid id'))

}

// =======================add job schema

export const addJobSchema={
    body:joi.object({
        jobTitle:joi.string().required(),
        jobLocation:joi.string().valid('onsite', 'remotely', 'hybrid'),
        workingTime:joi.string().valid('part-time','full-time'),
        seniorityLevel:joi.string().valid('Junior', 'Mid-Level', 'Senior','Team-Lead', 'CTO'),
        jobDescription:joi.string(),
        technicalSkills: joi.array().items(joi.string()),
        softSkills: joi.array().items(joi.string())
    }),
    headers:joi.object({
        token:joi.string().required()
    }).options({allowUnknown:true})
}

// =========================update job schema

export const updateJobSchema={
    body:joi.object({
        jobTitle:joi.string().required(),
        jobLocation:joi.string().valid('onsite', 'remotely', 'hybrid'),
        workingTime:joi.string().valid('part-time','full-time'),
        seniorityLevel:joi.string().valid('Junior', 'Mid-Level', 'Senior','Team-Lead', 'CTO'),
        jobDescription:joi.string(),
        technicalSkills: joi.array().items(joi.string()),
        softSkills: joi.array().items(joi.string())
    }),
    headers:joi.object({
        token:joi.string().required()
    }).options({allowUnknown:true}),
    query:joi.object({
        jobId:joi.string().custom(objectIdValidation).required()
    })

}
// ======================= delete job schema

export const deleteJobSchema={
    headers:joi.object({
        token:joi.string().required()
    }).options({allowUnknown:true}),
    query:joi.object({
        jobId:joi.string().custom(objectIdValidation).required()
    })

}

// ============================ Get all Jobs for a specific company. schema

export const getAllJobForSpecificCompanySchema={
    query:joi.object({
        companyName:joi.string().required()
    })
}

// ======================getAllJobsThatMatchFilter schema


export const getAllJobsThatMatchFilterSchema={
    body:joi.object({
        jobTitle:joi.string(),
        jobLocation:joi.string().valid('onsite', 'remotely', 'hybrid'),
        workingTime:joi.string().valid('part-time','full-time'),
        seniorityLevel:joi.string().valid('Junior', 'Mid-Level', 'Senior','Team-Lead', 'CTO'),
        jobDescription:joi.string(),
        technicalSkills: joi.array().items(joi.string()),
        softSkills: joi.array().items(joi.string())
    })   
}
