import { globalResponse } from './middleWares/globalResponse.js'
import userRouter from './modules/User/user.route.js'
import companyRouter from './modules/company/company.route.js'
import jobRouter from './modules/Job/job.route.js'

function bootstrap(app,express){


    app.use(express.json())

    app.use('/user',userRouter)
    app.use('/company',companyRouter)
    app.use('/job',jobRouter)
  

   


    app.use(globalResponse)



    app.use('/*',(_,res)=>{
        return res.send('invalid routing')
    })

}
export default bootstrap