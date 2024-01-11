class QueryBuilder {
    async insertDocument(coll: any, document: any): Promise<any> {
        try {
            // document['key-id']='demo-data-key';
            console.log("======================")
            return await coll.insertOne(document);
        } catch (error) {
            console.error('Error inserting document:', error);
            throw error;
        }
    }
    async findDocument(coll: any, filter: any, options?: any) {
        try {
            console.log("inside find document===================")
            console.log(filter,"-------------------------------")
            return await coll.findOne(filter, options);
        } catch (error) {
            console.error('Error finding documents:', error);
            throw error;
        }
    }
}

export const queryBuilder = new QueryBuilder();
