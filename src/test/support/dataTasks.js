const MongoClient = require('mongodb').MongoClient;
const tables = ['users', 'companies', 'teams', 'burndowns', 'tasks', 'stories'];

module.exports = async function(url) {
    let db = await MongoClient.connect(url);
    return {
        async deleteData() {
            return Promise.all(tables.map(table => {
                return db.collection(table).deleteMany({});
            }));
        },
        async prepareData() {

        }
    }
}
