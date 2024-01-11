import * as fs from "fs";
import * as crypto from "crypto";
import { MongoClient, ClientEncryption} from "mongodb";

async function getCredentials() {
  return {
    MONGODB_URI: "mongodb://localhost:27017/",
  };
}

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


export async function createDataKey() {
  const credentials = await getCredentials();
  const localMasterKeyPath = await createLocalMasterKey();
  const keyVaultClient = new MongoClient(credentials.MONGODB_URI);
  try {
    await keyVaultClient.connect();
    const keyVaultDB = keyVaultClient.db("encryption");
    const keyVaultColl = keyVaultDB.collection("__keyVault");

    await keyVaultColl.createIndex(
      { keyAltNames: 1 },
      {
        unique: true,
        partialFilterExpression: { keyAltNames: { $exists: true } },
      }
    );

    const localMasterKey = fs.readFileSync(localMasterKeyPath);
    const kmsProviders = {
      local: {
        key: localMasterKey,
      },
    };

    const encryption = new ClientEncryption(keyVaultClient, {
      keyVaultNamespace: "encryption.__keyVault",
      kmsProviders,
    });

    const provider = "local";
    const keyAltNames = ["demo-data-key"];//unique index created
    const key = await encryption.createDataKey(provider, { keyAltNames });
    console.log("DataKeyId [base64]:", key.toString("base64"));
  } finally {
    await keyVaultClient.close();
  }
}