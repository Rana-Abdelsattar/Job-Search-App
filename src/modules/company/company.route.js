import {Router} from 'express'
import * as companyController from './company.controller.js'
import { authentication } from '../../middleWares/authentication.middleWare.js'
import expressAsyncHandler from 'express-async-handler'
import { systemRoles } from '../../Utils/systemRoles.js'
import { validationMiddleWare } from '../../middleWares/validationMiddleWare.js'
import {addCompanySchema,updateCompanySchema,deleteCompanySchema,searchCompanySchema,getCompanyData,applicationForSpecificJob} from './company.validationSchema.js'
const router=Router()

router.post('/',authentication([systemRoles.CompanyHR]),validationMiddleWare(addCompanySchema),expressAsyncHandler(companyController.addCompany))
router.put('/',authentication([systemRoles.CompanyHR]),validationMiddleWare(updateCompanySchema),expressAsyncHandler(companyController.updateCompanyData))
router.delete('/',authentication([systemRoles.CompanyHR]),validationMiddleWare(deleteCompanySchema),expressAsyncHandler(companyController.deleteCompany))
router.get('/searchByName/:name',authentication([systemRoles.CompanyHR,systemRoles.USER]),validationMiddleWare(searchCompanySchema),expressAsyncHandler(companyController.searchForCompany))
router.get('/companyData',authentication([systemRoles.CompanyHR]),validationMiddleWare(getCompanyData),expressAsyncHandler(companyController.getCompanyData))
router.get('/application',authentication([systemRoles.CompanyHR]),validationMiddleWare(applicationForSpecificJob),expressAsyncHandler(companyController.getAllAplicationsForSpecificJob))

export default router