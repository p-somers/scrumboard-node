let people, auth;
async function waitForPersistence() {
    let collections = await require('../modules/collections')();

    people = collections.people;
    auth = collections.googleAuth;
}

module.exports = async function() {
    await waitForPersistence();

    return {
        async getAuthForTeam(personId) {
            //people.findById
        }
    };
};