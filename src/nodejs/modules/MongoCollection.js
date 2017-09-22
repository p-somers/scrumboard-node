class MongoCollection {
    constructor(db, collectionName) {
        this.db = db;
        this.collectionName = collectionName;
    }

    getCollection(callback) {
        this.db.collection(this.collectionName, function(error, thisCollection) {
            if(error) {
                callback(error);
            }
            else {
                callback(null, thisCollection);
            }
        });
    }

    find(user, callback) {
        this.getCollection(function(error, thisCollection) {
            if(error) {
                callback(error)
            }
            else {
                thisCollection.find(user).toArray(function(error, results) {
                    if(error) {
                        callback(error);
                    }
                    else {
                        callback(null, results);
                    }
                });
            }
        });
    }

    insert(user, callback) {
        this.getCollection(function(error, thisCollection) {
            if(error){
                callback(error);
            }
            else {

                thisCollection.insert(user, function(error, results) {
                    callback(error, results, user);
                });
            }
        });
    }

    removeOne(user, callback) {
        this.getCollection(function(error, thisCollection) {
            if(error){
                callback(error);
            }
            else {
                thisCollection.deleteOne(user, {}, function(error, results) {
                    callback(error, results);
                });
            }
        });
    }

    updateOne(user, updatedData, callback) {
        this.getCollection(function(error, thisCollection) {
            if(error){
                callback(error);
            }
            else {

                thisCollection.updateOne(user, updatedData, {upsert:false}, function(error, results) {
                    callback(error, results);
                });
            }
        });
    }

    findAndUpdateOne(query, updatedData, callback) {
        this.getCollection(function(error, thisCollection) {
            if(error){
                callback(error);
            }
            else {

                thisCollection.findOneAndUpdate(query, updatedData, {upsert:false, returnOriginal: false}, function(error, result) {
                    callback(error, result);
                });
            }
        });
    }

    aggregate(options, callback) {
        this.getCollection(function(error, thisCollection) {
            if(error){
                callback(error);
            }
            else {
                thisCollection.aggregate(options, function(error, results) {
                    callback(error, results);
                });
            }
        });
    }
}

module.exports = MongoCollection;