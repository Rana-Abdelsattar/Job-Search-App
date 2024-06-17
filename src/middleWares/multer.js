import multer from 'multer'
// import { nanoid } from 'nanoid'


export const multerMiddleWare=()=>{


    const storage= multer.diskStorage({
        filename:function(_,file,cb){
            cb(null,file.originalname)
        }
    })
    const fileFilter=(_,file,cb)=>{
        if(file.mimetype=='application/pdf')
        {
            return cb(null,true)
        }
        else{
            return cb(next(new Error('invalid file formate')),false)
        }
    }

    const file=multer({fileFilter,storage})
    return file

}