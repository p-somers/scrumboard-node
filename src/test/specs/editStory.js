require('../support/context');
const HomePage = require('../support/elements/pages/HomePage');
const EditStoryModal = require('../support/elements/modal/Story');

const assert = require('chai').assert;

suite('Edit Story', function () {
    let board;
    before(function() {
        login('test', 'password');
        board = new HomePage(browser).getBoard();
    });

    describe('when user edits a story', function() {
        let editStoryModal;
        before(function() {
            board.getStoryByName('Test Story').getStickyNote().click();
            editStoryModal = new EditStoryModal(browser);
            editStoryModal.getStoryNameInput().clear().sendKeys('#1 New Story - edited');
            editStoryModal.getStoryPointsInput().clear().sendKeys(4);
            editStoryModal.getACTextarea().clear().sendKeys('New Acceptance Criteria');
            editStoryModal.getAddACButton().click();
        });

        it('should be the Edit Story modal', function() {
            assert.equal(editStoryModal.getTitle(), 'Edit Story');
        });

        it('should have the correct team selected', function() {
            assert.equal(editStoryModal.getTeamSelector().getText(), 'TEAM1');
        });

        it('should reflect the new acceptance criteria in the list', function() {
            let ac = editStoryModal.getAC();
            assert.equal(ac.length, 2);
            assert.equal(ac[1].getText(), 'New Acceptance Criteria');
        });

        it('should clear the "New Criteria" box', function() {
            assert.isEmpty(editStoryModal.getACTextarea().getText());
        });

        describe('when the user saves the story', function() {
            before(function() {
                editStoryModal.getSaveButton().click();
                browser.waitUntil(() => !editStoryModal.isDisplayed());
            });

            it('should hide the modal window', function() {
                assert.isFalse(editStoryModal.isDisplayed());
            });

            it('should show the story in the table', () => {
                let stories = board.getStories();
                assert.isAtLeast(stories.length, 1);
                let story = stories.pop();
                assert.equal(story.getName(), '#1 New Story - edited');
                assert.equal(story.getStoryPoints(), '4');
            });
        });
    });
});