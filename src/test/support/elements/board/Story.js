const DomNode = require('../DomNode');
const Task = require('./Task');
const ADD_TASK_BUTTON_SELECTOR = 'button.addTaskButton';
const NAME_SELECTOR = 'span.story-name';
const STICKY_NOTE_SELECTOR = 'div.story-descr';
const STORY_POINTS_SELECTOR = 'div.points';
const TASKS_SELECTOR = 'div.task';

class Story extends DomNode {
    constructor(obj) {
        super(obj._browser, obj.webElementId);
    }

    getAddTaskButton() {
        return this.getChild(ADD_TASK_BUTTON_SELECTOR);
    }

    getName() {
        return this.getChild(NAME_SELECTOR).getText();
    }

    getStickyNote() {
        return this.getChild(STICKY_NOTE_SELECTOR);
    }

    getStoryPoints() {
        return this.getChild(STORY_POINTS_SELECTOR).getText();
    }

    getTasks() {
        return this.getChildren(TASKS_SELECTOR).map(task => {
            return new Task(task)
        });
    }

    getTaskByName(name) {
        return this.getTasks().find(task => {
            return task.getName() === name;
        });
    }
}

module.exports = Story;