const fs = require('fs');
const MongoClient = require('mongodb').MongoClient;
const tables = ['users', 'companies', 'teams', 'burndowns', 'tasks', 'stories'];
const dataDir = __dirname + '/data';

module.exports = async function(url) {
    let db = await MongoClient.connect(url);

    async function importFile(filename) {
        return new Promise(resolve => {
            let table = filename.split('.')[0];
            let type = filename.split('.')[1];
            if (tables.includes(table)) {
                let data = require(dataDir + '/' + filename);
                db.collection(table, (error, collection) => {
                    collection.insertMany(data).then(resolve);
                });
            }
        });
    }

    return {
        async deleteData() {
            return Promise.all(tables.map(table => {
                return db.collection(table).deleteMany({});
            }));
        },
        async prepareData() {
            return new Promise(resolve => {
                fs.readdir(dataDir, function(error, files) {
                    if (error) {
                        console.error('error reading test data directory', error);
                    } else {
                        Promise.all(files.map(filename => {return importFile(filename);})).then(resolve);
                    }
                });
            })
        }
    }
}
