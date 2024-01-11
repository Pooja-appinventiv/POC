import express from "express";
import { getData } from "../controller/user_controller";
import { getData1 } from "../controller/med_controller";

export const router= express();
console.log("inside route")
router.post('/signup',getData.signup)
router.post('/profile',getData.userprofile)
router.post('/med',getData1.medentry)