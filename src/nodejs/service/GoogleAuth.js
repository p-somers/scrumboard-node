const Service = require('./Service');
const google = require('googleapis');
const credentials = require('../google/client_secret.json');
const config = require('config');
let OAuth2 = google.auth.OAuth2;

const port = config.get('port');

let clientSecret = credentials.installed.client_secret;
let clientId = credentials.installed.client_id;
let redirectUrl = `http://localhost:${port}/google/saveAuth`;
let oauth2Client = new OAuth2(clientId, clientSecret, redirectUrl);

function isEmpty(obj) {
    if (!obj) {
        return true;
    }

    for(var key in obj) {
        if(obj.hasOwnProperty(key))
            return false;
    }
    return true;
}

function findIndexOfStringIgnoreCase(array, str) {
    return array.findIndex(val => val.toLowerCase() === str.toLowerCase());
}

class GoogleAuth extends Service {
    fetchAndSaveTokenFromCode(userId, code) {
        let service = this;
        oauth2Client.getToken(code, function (err, tokens) {
            if (err) {
                //TODO: something
            } else {
                service.googleAuthDao.saveTokens(userId, tokens);
                oauth2Client.setCredentials(tokens);
            }
        });
    }

    getAuthUrl() {
        return oauth2Client.generateAuthUrl({
            access_type: 'offline',
            scope: 'https://www.googleapis.com/auth/spreadsheets'
        });
    }

    processSpreadsheetData(columnNames, dataArray) {
        let nameColIndex = findIndexOfStringIgnoreCase(columnNames, 'title');
        let pointsColIndex = findIndexOfStringIgnoreCase(columnNames, 'size');
        let accCriColIndex = findIndexOfStringIgnoreCase(columnNames, 'story');
        let sprintNumColIndex = findIndexOfStringIgnoreCase(columnNames, 'sprint');
        let notesColIndex = findIndexOfStringIgnoreCase(columnNames, 'notes');
        let sprints = {};
        dataArray.forEach(story => {
            let sprintNum = parseInt(story[sprintNumColIndex]);
            if (Array.isArray(sprints[sprintNum])) {
                sprints[sprintNum].push({
                    name: story[nameColIndex],
                    points: story[pointsColIndex],
                    acceptanceCriteria: story[accCriColIndex].split('\n').map(ac => {return {name: ac, isChecked: false}}),
                    notes: story[notesColIndex]
                });
            } else {
                sprints[sprintNum] = [];
            }
        });
        debugger;
    }

    async fetchSpreadsheetData(spreadsheetId, userId) {
        let sheets = google.sheets('v4');
        let service = this;
        if (isEmpty(oauth2Client.credentials)) {
            let results = await this.googleAuthDao.find({'userId': userId});
            if (results.length === 0) {
                throw new Error('Credentials not found');
            }

            oauth2Client.setCredentials(results[0].tokens);
        }
        sheets.spreadsheets.values.get({
            auth: oauth2Client,
            spreadsheetId: spreadsheetId,
            range: 'A:E',
        }, function(err, response) {
            if (err) {

            } else {
                service.processSpreadsheetData(response.values.shift(), response.values);
            }
        });
    }

    async getOrClearAuthIfExpired(userId) {
        let results = await this.googleAuthDao.find({'userId': userId});
        if (results.length === 0) {
            return;
        }

        let auth = results[0];
        if(auth.tokens.expiry_date < Date.now()) {
            debugger;
        }
    }

    async hasAuth(userId) {
        let results = await this.googleAuthDao.find({'userId': userId});
        return results.length > 0;
    }

    setGoogleAuthDao(dao) {
        this.googleAuthDao = dao;
    }
}

module.exports = GoogleAuth;