const DomNode = require('../DomNode');

const NAME_SELECTOR = 'span.task-name';
const HOURS_SELECTOR = 'div.points';

class Task extends DomNode {
    constructor(obj) {
        super(obj._browser, obj.webElementId);
    }

    getHours() {
        return this.getChild(HOURS_SELECTOR).getText();
    }

    getName() {
        return this.getChild(NAME_SELECTOR).getText();
    }
}

module.exports = Task;