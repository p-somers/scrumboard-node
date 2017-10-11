require('../support/context');
const HomePage = require('../support/elements/pages/HomePage');
const AddTaskModal = require('../support/elements/modal/Task');

const assert = require('chai').assert;

suite('Add Task', function () {
    let board;
    before(function() {
        login('test', 'password');
        board = new HomePage(browser).getBoard();
    });

    describe('when a user clicks the "add task" button', function() {
        let addTaskModal, story, task;
        before(function() {
            story = board.getStoryByName('Test Task');
            story.getAddTaskButton().click();
            addTaskModal = new AddTaskModal(browser);
            addTaskModal.getTaskNameInput().clear().sendKeys('New Test Task');
            addTaskModal.getHoursInput().sendKeys('16');
            addTaskModal.getNotesInput().sendKeys('Task Notes');
            addTaskModal.getSaveButton().click();
            task = story.getTaskByName('Test Task');
        });

        it('should show the new task on the board', function() {
            assert.exists(task);
            assert.equal(task.getName(), 'Test Task');
            assert.equal(task.getHours(), '16');
        });
    });
});