const assert = require('assert');

let teams;
async function waitForPersistence() {
    let collections = await require('./modules/collections')();
    teams = collections.teams;
}

function hasSocketPermissionForTeam(socket, teamId, callback) {
    teams.find({'_id': teamId}, function(err, results) {
		assert.equal(err, null);
		if(results.length === 1) {
			var team = results[0];
			if(team.companyId == socket.request.session.companyId) {
				callback();
			}
			else {
				console.log('not match');
			}
		}
		else {
			console.log('mongo issue');
		}
	});
}

module.exports = async function(socket) {
	await waitForPersistence();

	if(!socket.request.session.userId || !socket.request.session.companyId) {
		//How to throw error?
	} else {
		socket.on('join room', function(teamId) {
	        hasSocketPermissionForTeam(socket, teamId, function() {
	        	if(socket.room) {
	        		socket.leave(socket.room);
	        	}
	        	socket.room = teamId;
	        	socket.join(teamId);
	        });
	    });
	}
};