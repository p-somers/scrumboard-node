const DomNode = require('../DomNode');
const STORY_NAME_SELECTOR = 'span.story-name';
const STORY_POINTS_SELECTOR = 'div.points';

class Story extends DomNode {
    constructor(obj) {
        super(obj._browser, obj.webElementId);
    }

    getName() {
        return this.getChild(STORY_NAME_SELECTOR).getText();
    }

    getStoryPoints() {
        return this.getChild(STORY_POINTS_SELECTOR).getText();
    }
}

module.exports = Story;