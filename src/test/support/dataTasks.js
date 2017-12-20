const fs = require('fs');
const path = require('path');
const MongoClient = require('mongodb').MongoClient;
const tables = ['users', 'companies', 'teams', 'burndowns', 'tasks', 'stories'];
const dataDir = path.resolve(__dirname, path.join('..', 'data'));

module.exports = async function(url) {
    let db = await MongoClient.connect(url);

    async function importFile(filename) {
        console.log('importing ' + filename);
        return new Promise(resolve => {
            let table = filename.split('.')[0];
            let type = filename.split('.')[1];
            if (tables.includes(table)) {
                let data = require(dataDir + '/' + filename);
                db.collection(table, (error, collection) => {
                    collection.insertMany(data).then(resolve);
                });
            } else {
                console.error('Error importing ' + filename + ': ' + table + ' not in list of importable tables');
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
                console.log('importing files in ' + dataDir);
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
