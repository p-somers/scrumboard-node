const DomNode = require('../DomNode');
const Column = require('./Column');
const Story = require('./Story');

const ID = '#board';

const STORY_SELECTOR = 'div.row.story';
const ADD_STORY_BUTTON_SELECTOR = '#addStoryButton';
const COLUMN_HEADERS_SELECTOR = 'div.progressCol';

class Board extends DomNode {
    constructor(_browser) {
        let webElement = _browser.element(ID);
        if (webElement.state !== 'success') {
            throw new Error('Could not instantiate Board');
        }
        super(_browser, webElement.value.ELEMENT);
    }

    getAddStoryButton() {
        return this.getChild(ADD_STORY_BUTTON_SELECTOR);
    }

    getColumnHeaders() {
        return this.getChildren(COLUMN_HEADERS_SELECTOR).map(column => {
            return new Column(column);
        });
    }

    getStories() {
        return this.getChildren(STORY_SELECTOR).map(story => {
            return new Story(story)
        });
    }

    getStoryByName(name) {
        return this.getStories().find(story => {
            return story.getName() === name;
        });
    }
}

module.exports = Board;