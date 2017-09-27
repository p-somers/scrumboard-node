require('../support/context');
const HomePage = require('../support/elements/pages/HomePage');
const AddStoryModal = require('../support/elements/modal/StoryModal');

const assert = require('chai').assert;

let page, addStoryModal;
suite('Create Story', function () {
    before(function() {
        login('test', 'password');
        page = new HomePage(browser);
    });

    describe('when user creates a new story', function() {
        before(function() {
            page.getAddStoryButton().click();
            addStoryModal = new AddStoryModal(browser);
            addStoryModal.getStoryNameInput().clear().sendKeys('#1 New Story');
            addStoryModal.getStoryPointsInput().sendKeys(8);
            addStoryModal.getACTextarea().clear().sendKeys('New Acceptance Criteria');
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
            assert.equal(ac[0].getText(), 'New Acceptance Criteria');
        });

        it('should clear the "New Criteria" box', function() {
            assert.isEmpty(addStoryModal.getACTextarea().getText());
        });

        describe('when the user saves the story', function() {

        });
    });
});