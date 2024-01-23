import { MongoClient, MongoClientOptions } from 'mongodb';
import { userSchema } from '../schema/uuserschema';
import fs from 'fs';
import dotenv from "dotenv"
import { APP_STATIC } from '../constants/constant';
import { medSchema } from '../schema/medicineschema';
import appConfig from '../common/config';
import { createDataKey } from './keyVaultGen';
dotenv.config()
const localMasterKey = fs.readFileSync(appConfig.env.CUSTOMER_MASTER_KEY);
const kmsProviders = {
  local: {
    key: localMasterKey,
  },
};
const keyVaultNamespace = appConfig.env.KEY_VAULT_NAME_SPACE;
class AutoEncryptionMongo {
  private securedClient: MongoClient;
  private unencryptedClient: MongoClient;
  constructor() {
    this.unencryptedClient = new MongoClient(appConfig.env.MONGODB_URL)
    this.connect()
  }
  public async connect() {
    const key = await this.getKey()
    console.log("key obtained", key)
    const options: MongoClientOptions = {
      autoEncryption: {
        keyVaultNamespace,
        kmsProviders,
        schemaMap: {
          user: userSchema(key),
          medical: medSchema(key),
        },
      },
    };
    try {
      this.securedClient = new MongoClient(appConfig.env.MONGODB_URL, options);
      await this.securedClient.connect();
      return APP_STATIC.MONGODB.CONNECTED
    } catch (error) {
      console.error(error);
    }
  }
  returnSecuredClient(schema) {
    let db, coll;
  
    switch (schema) {
      case 'userSchema':
        db = APP_STATIC.MONGODB.db;
        coll = APP_STATIC.MONGODB.coll;
        break;
  
      case 'medSchema':
        db = APP_STATIC.MONGODB.dbName;
        coll = APP_STATIC.MONGODB.collName;
        break;

      default:
        break;
    }
    return this.securedClient.db(db).collection(coll);
  }
  
  public async getKey(): Promise<any> {
    await this.unencryptedClient.connect();
    const keyVaultCollection = this.unencryptedClient.db(appConfig.env.KEY_DATABASE).collection(appConfig.env.KEY_COLLECTION);
    let finalKey = await keyVaultCollection.find().toArray();
    if (finalKey.length) {
      console.log("key found")
      const id = finalKey[0]._id;
      const keyValue = id.toString();
      return keyValue
    }
    else
    {
      const key = await createDataKey()
      return key

    }
  }
}
export const autoEnc = new AutoEncryptionMongo()