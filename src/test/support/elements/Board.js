const DomNode = require('./DomNode');

const ID = '#board';

class Column extends DomNode {
    constructor(obj) {
        super(obj._browser, obj.webElementId);
    }

    getHeaderText() {
        return this.getChild('h4').getText();
    }
}

class Board extends DomNode {
    constructor(_browser) {
        let webElement = _browser.element(ID);
        if (webElement.state !== 'success') {
            throw new Error('Could not instantiate Board');
        }
        super(_browser, webElement.value.ELEMENT);
    }

    getColumnHeaders() {
        return this.getChildren('div.progressCol').map(column => {
            return new Column(column);
        });
    }
}

module.exports = Board;