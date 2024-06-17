import express from 'express'
import bootstrap from './src/index.route.js'
import { config } from 'dotenv'
import db_connection from './DB/connection.js'


config({path:'./config/dev.env'})
const app=express()
bootstrap(app,express)
db_connection()
app.listen(process.env.PORT,()=>{console.log('server is running on port 3000')})

