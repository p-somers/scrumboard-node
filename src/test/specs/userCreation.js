require('../support/context');

const LoginPage = require('../support/elements/pages/LoginPage');

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
        let signUpModal;
        before(function() {
            page.getSignUpButton().click();
            signUpModal = page.getSignUpModal();
        });

        it('should show modal window', function() {
            assert.isTrue(signUpModal.isDisplayed());
            assert.equal(signUpModal.getTitle(), 'Sign Up');
        });

        describe('when a user fills out all fields correctly', function() {
            before(function() {
                signUpModal.getFullNameInput().sendKeys('Eugene Amadeus Percival the Third');
                signUpModal.getUsernameInput().sendKeys('flower_advocate');
                signUpModal.getEmailInput().sendKeys('a@a.com');
                signUpModal.getPasswordInput().sendKeys('hunter1');
                signUpModal.getPasswordConfirmationInput().sendKeys('hunter1');
                signUpModal.getSubmitButton().click();
                waitUntil(() => {
                    return !signUpModal.isDisplayed();
                }, 'expected sign up modal to hide');
            });

            it('should show the confirmation', function() {
                assert.isTrue(page.getSignUpConfirmation().isDisplayed());
            });
        });
    });
});