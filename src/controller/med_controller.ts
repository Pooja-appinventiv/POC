import { NextFunction } from "express";
import { APP_STATIC } from "../constants/constant";
import { Request, Response } from "express";
import { queryBuilder } from "../querybuilder/user.querybuilder";
import { autoEnc } from "../database/conncetion";
class medcontroller{
    medentry = async (req: Request, res: Response,next:NextFunction) => {
        try{
            const coll = autoEnc.returnsecured1Client()
            const data = req.body;
            const result =  await queryBuilder.insertDocument(coll, data);
            res.status(201).json({ message: APP_STATIC.SUCCESS.REGISTRATION_SUCCES,result});
        }
        catch(error){
            console.log(APP_STATIC.ERROR.REGISTRATION_ERROR, error);
        }
    }
   
}
export const getData1=new medcontroller();