const DomNode = require('../DomNode');
const config = require('../../config.json');
const baseUrl = config.baseUrl || 'http://localhost:' + config.port || 5001;

class AbstractPage extends DomNode {
    constructor(_browser) {
        let htmlNode = _browser.element('html');
        super(_browser, htmlNode.value.ELEMENT);
    }

    checkUrl(relativePath) {
        let expectedUrl = (baseUrl.endsWith('/') ? baseUrl.substring(0, baseUrl.length - 1) : baseUrl) + relativePath;
        let actualUrl = this._browser.getUrl();
        if(actualUrl !== expectedUrl){
            throw new Error('Could not construct page object; incorrect url.\nExpected: ' + expectedUrl + '\nActual: ' + actualUrl);
        }
    }
}

module.exports = AbstractPage;