import {Router} from 'express'

import * as jobControllers from './job.controllers.js'
import { authentication } from '../../middleWares/authentication.middleWare.js'
import { systemRoles } from '../../Utils/systemRoles.js'
import expressAsyncHandler from 'express-async-handler'
import { validationMiddleWare } from '../../middleWares/validationMiddleWare.js'
import {addJobSchema,updateJobSchema,deleteJobSchema,getAllJobForSpecificCompanySchema,getAllJobsThatMatchFilterSchema} from './job.validationSchema.js'

import {multerMiddleWare} from '../../middleWares/multer.js'

 const router=Router()
 
 router.post('/',authentication([systemRoles.CompanyHR]),validationMiddleWare(addJobSchema),expressAsyncHandler(jobControllers.addJob))
router.put('/',authentication([systemRoles.CompanyHR]),validationMiddleWare(updateJobSchema),expressAsyncHandler(jobControllers.updateJob))
router.delete('/',authentication([systemRoles.CompanyHR]),validationMiddleWare(deleteJobSchema),expressAsyncHandler(jobControllers.deleteJob))

router.get('/',authentication([systemRoles.CompanyHR,systemRoles.USER]),expressAsyncHandler(jobControllers.getAllJobsWithCompanyInfo))
router.get('/allJobsForSpecificCompany',authentication([systemRoles.CompanyHR,systemRoles.USER]),validationMiddleWare(getAllJobForSpecificCompanySchema),expressAsyncHandler(jobControllers.getAlljobsforSpecificCompany))

router.get('/getAllJobsThatMatchFilter',authentication([systemRoles.CompanyHR,systemRoles.USER]),validationMiddleWare(getAllJobsThatMatchFilterSchema),expressAsyncHandler(jobControllers.getAllJobsThatMatchFilter))

router.post('/applyToJob',authentication([systemRoles.USER]),multerMiddleWare().single('cv'),expressAsyncHandler(jobControllers.applyToJob))
 export default router