import { BSON } from 'mongodb';
export function medSchema(key: any) {
    try {
        const dbName = 'medicineRecords';
        const collName = 'medicine';
        const medSchemaMap: any = {
            [`${dbName}.${collName}`]: {
                bsonType: 'object',
                encryptMetadata: {
                    // keyId: [new BSON.UUID("7f88eddf-7413-4e26-9031-a1c782c9d772")],
                    keyId: [new BSON.UUID(key)],
                },
                properties: {
                    name: {
                        encrypt: {
                            bsonType: 'string',
                            algorithm: 'AEAD_AES_256_CBC_HMAC_SHA_512-Deterministic',
                        },
                    },
                    description: {
                        encrypt: {
                            bsonType: 'string',
                            algorithm: 'AEAD_AES_256_CBC_HMAC_SHA_512-Deterministic',
                        },
                    },
                    date_of_packaging: {
                        encrypt: {
                            bsonType: 'string',
                            algorithm: 'AEAD_AES_256_CBC_HMAC_SHA_512-Deterministic',
                        },
                    },
                },
            },
        };

        return medSchemaMap;
    } catch (error) {
        console.log(error);
        throw error;
    }
}

