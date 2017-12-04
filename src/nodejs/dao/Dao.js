class DaoObj {
    constructor(_tableName) {
        if (_tableName) {
            this.tableName = _tableName;
        } else {
            throw new Error('No table name specified');
        }
    }

    setDB(_db) {
        let daoObj = this;
        this.db =_db;
        return new Promise((resolve, reject) => {
            this.db.collection(daoObj.tableName, function(error, _collection) {
                if (error) {
                    reject(error);
                } else if (!_collection) {
                    reject(new Error('No collection returned for ' + daoObj.tableName));
                } else {
                    daoObj.collection = _collection;
                    resolve();
                }
            });
        });
    }

    findOne(filter) {
        return this.collection.findOne(filter || {});
    }

    find(filter) {
        let daoObj = this;
        return new Promise((resolve, reject) => {
            if (daoObj.collection) {
                daoObj.collection.find(filter || {}).toArray((error, results) => {
                    if (error) {
                        console.error(error);
                        reject(error);
                        return;
                    }

                    resolve(results);
                });
            } else {
                reject('No collection found for ' + daoObj.tableName + ' dao object');
            }
        });
    }

    async findById(id) {
        let results = await this.find({'_id': id});
        if (results.length === 0) {
            throw new Error(`${this.constructor.name} Dao did not find any objects with id ${id}`);
        }
        if (results.length > 1) {
            throw new Error(`${this.constructor.name} Dao found multiple objects with id ${id}`);
        }
        return results[0];
    }

    updateOne(id, properties) {
        return this.collection.updateOne(
            {
                '_id': id
            },
            {
                $set: properties
            }
        )
    }

    findOneAndUpdate(filter, operation) {
        return this.collection.findOneAndUpdate(
            filter,
            operation,
            {
                'returnOriginal': false
            }
        );
    }

    findOneByIdAndUpdate(id, operation) {
        return this.findOneAndUpdate(
            {
                '_id': id
            },
            operation
        );
    }

    insert(objects) {
        return this.collection.insert(objects);
    }

    deleteById(id) {
        return this.collection.removeOne({'_id': id});
    }
}

module.exports = DaoObj;