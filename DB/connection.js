import mongoose from "mongoose";


const db_connection= async()=>{
     await mongoose.connect(process.env.DB_URL)
         .then((res)=>{console.log('DB connection successfully')})
         .catch((err)=>{console.log('DB connection fail',err)})

}

export default db_connection