require('../../support/context');

const LoginPage = require('../../support/pages/LoginPage');
//const dbCollections = require('../../../nodejs/modules/collections');

const assert = require('chai').assert;

let page;
suite('User Creation', function () {
    before(function() {
        browser.url('/');
        page = new LoginPage(browser);
    });

    it('should load Scrumboard', function () {
        assert.equal('Scrumboard', browser.getTitle());
    });

    describe('When user clicks sign up button', function() {
        it('should show modal window', function() {
            browser.click('#signUp');
            let signUpModal = page.getSignupModal();
            assert.exists(signUpModal);
            assert.equal(signUpModal.getTitle(), 'Sign Up');
            signUpModal.getFullNameInput().sendKeys('Eugene Amadeus Percival the Third');
            signUpModal.getUsernameInput().sendKeys('flower_advocate');
            signUpModal.getEmailInput().sendKeys('a@a.com');
            signUpModal.getPasswordInput().sendKeys('hunter1');
            signUpModal.getPasswordConfirmationInput().sendKeys('hunter1');
            signUpModal.getSubmitButton().click();
            debugger;
        });
    });
});