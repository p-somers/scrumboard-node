const routes = require('express').Router();

module.exports = async function() {
    const tasks = await require('./tasks').apply(this, arguments);
    const teams = await require('./teams').apply(this, arguments);
    const burndown = await require('./burndown').apply(this, arguments);
    const people = await require('./people').apply(this, arguments);
    const auth = await require('./auth').apply(this, arguments);

    teams.use('/:teamId/stories/:storyId/tasks', tasks);
    teams.use('/:teamId/burndown', burndown);
    teams.use('/:teamId/people', people);
    routes.use('/teams', teams);
    routes.use(auth);

    return routes;
};