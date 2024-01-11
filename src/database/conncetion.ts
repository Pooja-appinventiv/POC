import { MongoClient, MongoClientOptions } from 'mongodb';
import { userSchema } from '../schema/uuserschema';
import fs from 'fs';
import { APP_STATIC } from '../constants/constant';
import { medSchema } from '../schema/medicineschema';

const path = './master-key.txt';
const localMasterKey = fs.readFileSync(path);
const kmsProviders = {
  local: {
    key: localMasterKey,
  },
};
const connectionString = 'mongodb://0.0.0.0:27017/';
const keyVaultNamespace = 'encryption.__keyVault';

class AutoEncryptionMongo {
  private securedClient: MongoClient;
  private securedClient1:MongoClient;
  private unencryptedClient: MongoClient;
  constructor() {
    this.unencryptedClient = new MongoClient(connectionString)
     this.connect()
  }
  public async connect(){
    const key = await this.getKey()
    // console.log("key is",key)
    const options: MongoClientOptions = {
      autoEncryption: {
        keyVaultNamespace,
        kmsProviders,
        schemaMap:userSchema(key),
        // schemaMap:userSchema,
      },
    };
    const medical_options: MongoClientOptions = {
      autoEncryption: {
        keyVaultNamespace,
        kmsProviders,
        schemaMap:medSchema(key)
      },
    };

    try {
       this.securedClient = new MongoClient(connectionString, options);
       this.securedClient1=new MongoClient(connectionString,medical_options)
       await this.securedClient.connect();
       await this.securedClient1.connect()
       console.log(APP_STATIC.MONGODB.CONNECTED)
    } catch (error) {
      console.error(APP_STATIC.MONGODB.NOT_CONNECTED, error);
      throw error;
    }
  }

  returnSecuredClient() {
    return this.securedClient.db(APP_STATIC.MONGODB.db).collection(APP_STATIC.MONGODB.coll)
  }
  returnsecured1Client() {
    return this.securedClient1.db(APP_STATIC.MONGODB.dbName).collection(APP_STATIC.MONGODB.collName)
  }

  public async getKey(): Promise<any> {
    await this.unencryptedClient.connect();
    const keyVaultCollection = this.unencryptedClient.db('encryption').collection('__keyVault');
    const finalKey = await keyVaultCollection.find().toArray();
    if (finalKey.length) {
        console.log(APP_STATIC.KEYS.FOUND);

        const id = finalKey[0]._id;
        const keyValue = id.toString();
        return keyValue;
    } else {
        console.log(APP_STATIC.KEYS.NOT_FOUND); 
    }
}
}
export const autoEnc = new AutoEncryptionMongo()







// import { ClientEncryption, MongoClient, MongoClientOptions} from 'mongodb';
// import fs from 'fs';
// import { userSchema } from '../schema/uuserschema';
// const db = 'medicalRecords';
// const coll = 'patients';

// const path = './master-key.txt';
// const localMasterKey = fs.readFileSync(path);
// const kmsProviders = {
//   local: {
//     key: localMasterKey,
//   },
// };

// const connectionString = 'mongodb://0.0.0.0:27017/';
// const keyVaultNamespace = 'encryption.__keyVault';

// class AutoEncryptionMongo {
//   public securedClient: MongoClient;
//   constructor()
//   {
//     this.securedClient= new MongoClient(connectionString)
//   }

//   async connect(): Promise<MongoClient> {
//     // const schemaMap = {
//     //   'userSchema': userSchema,
//     // };
//     const key = await this.getKey();
//     console.log(key)
//     const options: MongoClientOptions = {
//       autoEncryption: {
//         keyVaultNamespace,
//         kmsProviders,
//         schemaMap:userSchema(key),
//         // schemaMap:userSchema,
//       },
//     };

//     try {
//       const client = new MongoClient(connectionString, options);
//       this.securedClient = await client.connect();
//       return this.securedClient;
//     } catch (error) {
//       console.error('Error connecting to MongoDB:', error);
//       throw error; 
//     }
//   }

//   async returnSecuredClient()
//   {
//     return this.securedClient.db(db).collection(coll)
//   }

//   public async getKey(): Promise<any> {
//     await this.securedClient.connect();
//     const keyVaultCollection = this.securedClient.db('encryption').collection('__keyVault');
//     const finalKey = await keyVaultCollection.find().toArray();
//     if (finalKey.length) {
//         console.log('key found in the keyVault');

//         const id = finalKey[0]._id;
//         const keyValue = id.toString();
//         return keyValue;
//     } else {
//         console.log('No key found in keyVault');
//         const userEncryptedClient = new ClientEncryption(this.securedClient, {
//             kmsProviders: kmsProviders,
//             keyVaultNamespace: keyVaultNamespace,
//         });
//         const dataKey = await userEncryptedClient.createDataKey('local'
//         // , {
//         //     masterKey: {
//         //         region: 'us-east-1',
//         //         key: <string>config.get(Config.KMS_ARN_WITH_KEY), // CMK ARN here
//         //     },
//         //     keyAltNames: ['keyAltNames'],
//         // }
//         );
//         return dataKey.toString();
//       }
//    }
// }

// export const autoEnc = new AutoEncryptionMongo()

// // export async function DBmain() {
// //   const autoEncryptionMongo = new AutoEncryptionMongo();
// //   try {
// //      await autoEncryptionMongo.connect();
// //     console.log("connection using secure client established")
// //   } catch (error) {
// //     console.error('Error in main:', error);
// //   }
// // }


// // Example usage
// export async function DBmain() {

//   const autoEncryptionMongo = new AutoEncryptionMongo();
//   try {
//     const secureClient = await autoEncryptionMongo.connect();
//     console.log("connection using secure client established")
//     const dataToInsert = {
//       name: 'John Doe',
//       ssn: 123456789,
//       bloodType: 'O+',
//       'key-id': 'demo-data-key',
//       medicalRecords: [
//         { weight: 170, bloodPressure: '120/80' },
//         { weight: 160, bloodPressure: '115/75' },
//       ],
//       insurance: {
//         policyNumber: 987654,
//         provider: 'HealthGuard',
//       },
//     };

//     // const CliniciandataToInsert = {
//     //   name: 'Doe',
//     //   ssn: 123456789,
//     //   bloodType: 'O+',
//     //   'key-id': 'demo-data-key',
//     //   userId: new ObjectId('6597ac658b23a856dd2043c0'),
//     //   medicalRecords: [
//     //     { weight: 170, bloodPressure: '120/80' },
//     //     { weight: 160, bloodPressure: '115/75' },
//     //   ],
//     //   insurance: {
//     //     policyNumber: 987654,
//     //     provider: 'HealthGuard',
//     //   },
//     // };

//     // console.log("insert data execution started")
//     // // await secureClient.db(db).collection(coll).findOne(dataToInsert)
    
//     // console.log(secureClient.db(db).collection(coll))
//     // await secureClient.db(db).collection(coll).insertOne(dataToInsert)
//     // console.log("insert data execution completed")

//     // console.log("find data execution started")
//     // // const data = await secureClient.db(db).collection(coll).findOne({ name: /John/ })

//     // // console.log("data is",data)
//     // console.log("find data execution completed")
//     //  // Do something with the connected client
//   } catch (error) {
//     // Handle the error
//     console.error('Error in main:', error);
//   }
// }








