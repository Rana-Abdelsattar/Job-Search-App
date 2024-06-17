import {Router} from 'express'
import expressAsyncHandler from 'express-async-handler'
import * as userControllers from './user.controller.js'
import { validationMiddleWare } from '../../middleWares/validationMiddleWare.js'
import {signUpSchema,signInSchema,updateAccountSchema,updatePasswordSchema,getProfileDataForAnotherUser,resetPasswordSchema,getAccountsAssociatedToRecoveryEmail,generateOTPSchema} from './user.validationSchema.js'
import { authentication } from '../../middleWares/authentication.middleWare.js'
import { systemRoles } from '../../Utils/systemRoles.js'




const router=Router()

router.post('/',validationMiddleWare(signUpSchema),expressAsyncHandler(userControllers.signUp))
router.post('/signIn',validationMiddleWare(signInSchema),expressAsyncHandler(userControllers.signIn))
router.put('/updateAccount',authentication([systemRoles.USER,systemRoles.CompanyHR]),validationMiddleWare(updateAccountSchema),expressAsyncHandler(userControllers.updateAccount))
router.delete('/deleteAccount',authentication([systemRoles.USER,systemRoles.CompanyHR]),expressAsyncHandler(userControllers.deleteAccount))
router.get('/',authentication([systemRoles.USER,systemRoles.CompanyHR]),expressAsyncHandler(userControllers.getUserAccountData))

router.get('/getDataForAnotherUser/:userId',authentication([systemRoles.USER,systemRoles.CompanyHR]),validationMiddleWare(getProfileDataForAnotherUser),expressAsyncHandler(userControllers.getProfileDataForAnotherUser))
router.patch('/updatePassword',authentication([systemRoles.USER,systemRoles.CompanyHR]),validationMiddleWare(updatePasswordSchema),expressAsyncHandler(userControllers.updatePassword))
router.get('/accountsForRecoveryEmail',authentication([systemRoles.USER,systemRoles.CompanyHR]),validationMiddleWare(getAccountsAssociatedToRecoveryEmail),expressAsyncHandler(userControllers.getAllAccountsAssociatedToRecoveryEmail))
router.post('/generateOTP',validationMiddleWare(generateOTPSchema),expressAsyncHandler(userControllers.generateOTP))
router.post('/resetPassword',validationMiddleWare(resetPasswordSchema),expressAsyncHandler(userControllers.resetPassword))


export default router


