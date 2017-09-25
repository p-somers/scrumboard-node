const MongoClient = require('mongodb').MongoClient;
const tables = ['users', 'companies', 'teams', 'burndowns', 'tasks', 'stories'];

module.exports = async function(url) {
    let db = await MongoClient.connect(url);
    return {
        deleteData: async function() {
            return Promise.all(tables.map(table => {
                return db.collection(table).deleteMany({});
            }));
        }
    }
}
