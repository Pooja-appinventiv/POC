import express from "express";
import * as fs from "fs";
import * as crypto from "crypto";
import { router } from "./src/routes/user.route";
import { autoEnc } from "./src/database/conncetion";
import { createDataKey } from "./src/database/keyVaultGen";
async function createLocalMasterKey() {
    const path = "./master-key.txt";
  
    try {
      fs.writeFileSync(path, crypto.randomBytes(96));
      console.log("Local master key created successfully.");
    } catch (err) {
      console.error("Error creating local master key:", err);
    }
  
    return path;
  }
// createLocalMasterKey();
const app = express();
app.use(express.json()); 
app.use('/api1', router);

// createDataKey();
(async () => {
    try {
      autoEnc;
      app.listen(3011, () => {
        console.log(`Server is running`);
      });
    } catch (error) {
      console.error(`Error during server start`);
      console.error(error);
    }
  })();





// import { DBmain } from "./src/database/conncetion";
// import { router } from "./src/routes/user.route";
//generating i customer master key
// console.log("generating the customer master key")
// function generateCustomerMasterKey() {
//         const masterKey = randomBytes(32);
//         writeFileSync('./customer-master-key.txt', masterKey);
//         console.log('Customer master key generated and saved successfully.');
//     }
// generateCustomerMasterKey();




// await DBmain();
// app.use('/',(req:any,res:any)=>{
//     console.log("welcome")
// })

// app.listen(3011,()=>{

//     console.log("server is running of mongodb enterprises");
// })