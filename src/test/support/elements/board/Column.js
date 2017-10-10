const DomNode = require('../DomNode');

class Column extends DomNode {
    constructor(obj) {
        super(obj._browser, obj.webElementId);
    }

    getHeaderText() {
        return this.getChild('h4').getText();
    }
}

module.exports = Column;