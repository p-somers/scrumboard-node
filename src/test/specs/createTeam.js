require('../support/context');
const HomePage = require('../support/elements/pages/HomePage');

const assert = require('chai').assert;

let page;
suite('User Creation', function () {
    before(function() {
        login('test', 'password');
        page = new HomePage(browser);
    });

    it('should load Scrumboard', function () {
        assert.equal('Scrumboard', browser.getTitle());
    });

    describe('when user creates a new team', function() {
        before(function() {
            page.getTeamSelect().click();
            waitUntil(() => {
                return page.getTeamNameInput().isDisplayed();
            });
            page.getTeamNameInput().sendKeys('Team Name');
            page.getCreateThisTeamButton().click();
        });

        it('should update the team picker', function() {
            assert.equal(page.getTeamSelect().getText(), 'TEAM NAME');
        });

        it('should load an empty board for the new team', function() {
            assert.equal(page.getUnassignedPeopleDiv().getChild('div').getText(), 'People:');
            assert.isTrue(page.getAddPersonButton().isDisplayed());
            let columns = page.getBoard().getColumnHeaders();
            assert.equal(columns.length, 5);
            assert.equal(columns[0].getHeaderText(), 'Story');
            assert.equal(columns[1].getHeaderText(), 'Not Started');
            assert.equal(columns[2].getHeaderText(), 'In Progress');
            assert.equal(columns[3].getHeaderText(), 'To Be Verified');
            assert.equal(columns[4].getHeaderText(), 'Done');
        });
    });
});