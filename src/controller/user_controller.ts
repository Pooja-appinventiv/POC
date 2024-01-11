import { NextFunction } from "express";
import { APP_STATIC } from "../constants/constant";
import { Request, Response } from "express";
import { queryBuilder } from "../querybuilder/user.querybuilder";
import { autoEnc } from "../database/conncetion";
class usercontroller{
    signup = async (req: Request, res: Response,next:NextFunction) => {
        try{
            const coll = autoEnc.returnSecuredClient()
            const data = req.body;
            const result =  await queryBuilder.insertDocument(coll, data);
            res.status(201).json({ message: APP_STATIC.SUCCESS.REGISTRATION_SUCCES,result});
        }
        catch(error){
            console.log(APP_STATIC.ERROR.REGISTRATION_ERROR, error);
        }
    }
    userprofile=async(req:Request,res: Response,next:NextFunction)=>{
        try{
            const coll = autoEnc.returnSecuredClient()
            console.log("inside user profile-------------------")
            const data =req.body;
            const result=await queryBuilder.findDocument(coll,{email:data.email})
            res.status(200).json({ message: APP_STATIC.USER.USER_PROFILE});
        }
        catch(error){
            console.log(APP_STATIC.ERROR.USER_ERROR)
        }
    }
}
export const getData=new usercontroller();