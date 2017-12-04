const Service = require('./Service');
const bcrypt = require('bcryptjs');

class Auth extends Service {
    async logOut(session) {
        return new Promise(resolve => {
            session.destroy(resolve);
        });
    }

    async logIn(username, password, session) {
        username = username.toLowerCase();
        let user = this.userDao.findOne({username});

        if (user && bcrypt.compareSync(password, user.password)) {
            session.userId = user._id;
            session.companyId = user.companyId;
        } else {
            throw new Error('Not a valid username and password combination');
        }
    }

    async signUp(username, password, passwordConfirm, fullName, email) {

    }

    setUserDao(dao) {
        this.userDao = dao;
    }
}

module.exports = Auth;