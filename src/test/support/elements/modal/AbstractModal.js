const DomNode = require('../DomNode');

class AbstractModal extends DomNode {
    getTitle() {
        return this.getChild('.modal-title').getText();
    }

    getCloseButton() {
        return this.getChild('button.close');
    }
}

module.exports = AbstractModal;