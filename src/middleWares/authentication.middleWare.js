import jwt from 'jsonwebtoken'
import User from '../../DB/models/user.model.js'


export const authentication=(accessRoles)=>{

return async (req,_,next)=>{
  try{
    const{token}=req.headers;

    if(!token) return next(new Error('please login first',{cause:404}))
    
    if(!token.startsWith('accesstoken_')) return next(new Error('invalid access token prefix',{cause:400}))
    
    const accessToken= token.split('accesstoken_')[1];
    
    const decodedToken=jwt.verify(accessToken,process.env.TOKEN_SIGNATURE)
    if(!decodedToken || !decodedToken.id) return next(new Error('invalid token payload',{cause:400}))
    
    const user=await User.findById(decodedToken.id)  
    if(!user) return next(new Error('please login first',{cause:404}))
     
    // check Authorization 
    if(!accessRoles.includes(user.role)) return next(new Error('You are Not Authorized to Access this routers',{cause:401}))
    
    
    req.authUser=user
    next()
  }catch(err){
     next(new Error('Catch Error in Authentication Middleware',{cause:500}))
  }
    

}

}