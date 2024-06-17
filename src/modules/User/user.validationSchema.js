import joi from 'joi'
import { Types } from 'mongoose'


// ====custom validation for objectId

const objectIdValidation=(value,helper)=>{

    const isValid=Types.ObjectId.isValid(value)
    return(isValid ? value : helper.message('invalid id'))

}



// =================signUp schema
export const signUpSchema={
    body:joi.object({
        firstName:joi.string().min(3).max(15).required(),
        lastName:joi.string().min(3).max(15).required(),
        email:joi.string().email().required(),
        password:joi.string().pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/)
        .message(`password Requires at least one lowercase letter and at least one uppercase letter and at least one digit and minimum length of 8 characters.`).required(),
        recoveryEmail:joi.string().email().required(),
        DOB:joi.date(),
        mobileNumber:joi.string().pattern(/^01[0125][0-9]{8}$/)
        .message('Invalid mobile number'),
        role:joi.string().valid('User', 'Company_HR'),
        status:joi.string().valid('online','offline')
    })
}
// =======================signIn schema

export const signInSchema={
    body:joi.object({
        email:joi.string().email().required(),
        mobileNumber:joi.string().pattern(/^01[0125][0-9]{8}$/),
        password:joi.string().pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/)
        .message(`password Requires at least one lowercase letter and at least one uppercase letter and at least one digit and minimum length of 8 characters.`).required()
    })
}

// =========================update Account schema
export const updateAccountSchema={
    body:joi.object({
        firstName:joi.string().min(3).max(15),
        lastName:joi.string().min(3).max(15),
        email:joi.string().email(),
        recoveryEmail:joi.string().email(),
        DOB:joi.date(),
        mobileNumber:joi.string().pattern(/^01[0125][0-9]{8}$/)
        .message('Invalid mobile number'),

    }),
    headers:joi.object({
        token:joi.string().required()
    }).options({allowUnknown:true})
}
// ====================update password schema
export const updatePasswordSchema={
    body:joi.object({
        oldPassword:joi.string().pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/)
        .message(`password Requires at least one lowercase letter and at least one uppercase letter and at least one digit and minimum length of 8 characters.`).required(),
        newPassword:joi.string().pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/)
        .message(`password Requires at least one lowercase letter and at least one uppercase letter and at least one digit and minimum length of 8 characters.`).required()
    }),
    headers:joi.object({
        token:joi.string().required()
    }).options({allowUnknown:true})
}

// =====================get Profile Data For Another User schema
export const getProfileDataForAnotherUser={
    params:joi.object({
        userId:joi.string().custom(objectIdValidation).required()

    })
}
// 
// ======================generateOTP Schema
export const generateOTPSchema={
    body:joi.object({
        email:joi.string().email().required()
    })
}

// ======================resetPassword Schema

export const resetPasswordSchema={
body:joi.object({
    email:joi.string().email().required(),
     otp:joi.string().required(),
      newPassword:joi.string().pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/)
      .message(`password Requires at least one lowercase letter and at least one uppercase letter and at least one digit and minimum length of 8 characters.`).required() 
})

}


// ======================Get all accounts associated to a specific recovery Email (schema)

export const getAccountsAssociatedToRecoveryEmail ={
    body:joi.object({
        recoveryEmail:joi.string().email().required()  
    })
}

