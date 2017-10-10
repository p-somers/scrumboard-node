require('../support/context');
const HomePage = require('../support/elements/pages/HomePage');
const AddStoryModal = require('../support/elements/modal/StoryModal');

const assert = require('chai').assert;

suite('Create Story', function () {
    let board;
    before(function() {
        login('test', 'password');
        board = new HomePage(browser).getBoard();
    });

    describe('when user creates a new story', function() {
        let addStoryModal;
        before(function() {
            board.getAddStoryButton().click();
            addStoryModal = new AddStoryModal(browser);
            addStoryModal.getStoryNameInput().clear().sendKeys('#1 New Story');
            addStoryModal.getStoryPointsInput().sendKeys(8);
            addStoryModal.getACTextarea().clear().sendKeys('Acceptance Criteria');
            addStoryModal.getAddACButton().click();
        });

        it('should be the Add Story modal', function() {
            assert.equal(addStoryModal.getTitle(), 'Add Story');
        });

        it('should have the correct team selected', function() {
            assert.equal(addStoryModal.getTeamSelector().getText(), 'TEAM1');
        });

        it('should reflect the new acceptance criteria in the list', function() {
            let ac = addStoryModal.getAC();
            assert.equal(ac.length, 1);
            assert.equal(ac[0].getText(), 'Acceptance Criteria');
        });

        it('should clear the "New Criteria" box', function() {
            assert.isEmpty(addStoryModal.getACTextarea().getText());
        });

        describe('when the user saves the story', function() {
            before(function() {
                addStoryModal.getSaveButton().click();
                browser.waitUntil(() => !addStoryModal.isDisplayed());
            });

            it('should hide the modal window', function() {
                assert.isFalse(addStoryModal.isDisplayed());
            });

            it('should show the story in the table', () => {
                let stories = board.getStories();
                assert.isAtLeast(stories.length, 1);
                let story = stories.pop();
                assert.equal(story.getName(), '#1 New Story');
                assert.equal(story.getStoryPoints(), '8');
            });
        });
    });
});