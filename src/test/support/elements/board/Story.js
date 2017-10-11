const DomNode = require('../DomNode');
const STORY_NAME_SELECTOR = 'span.story-name';
const STICKY_NOTE_SELECTOR = 'div.story-descr';
const STORY_POINTS_SELECTOR = 'div.points';

class Story extends DomNode {
    constructor(obj) {
        super(obj._browser, obj.webElementId);
    }

    getName() {
        return this.getChild(STORY_NAME_SELECTOR).getText();
    }

    getStickyNote() {
        return this.getChild(STICKY_NOTE_SELECTOR);
    }

    getStoryPoints() {
        return this.getChild(STORY_POINTS_SELECTOR).getText();
    }
}

module.exports = Story;