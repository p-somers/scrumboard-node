const LOADING_TIMEOUT = 5 * 1000;
const TIMEOUT_MESSAGE = "Test timed out while waiting for element to be visible";
const LOADING_CHECK_INTERVAL = 100;

class DomNode{
    constructor(_browser, _webElementID) {
        this.webElementId = _webElementID;
        this._browser = _browser;
        this.waitTillLoaded();
    }

    clear() {
        this._browser.elementIdClear(this.webElementId);
    }

    click() {
        this._browser.elementIdClick(this.webElementId);
    }

    getCssProperty() {
        return this._browser.elementIdCssProperty(this.webElementId);
    }

    isDisplayed() {
        return this._browser.elementIdDisplayed(this.webElementId).value;
    }

    getChild(selector) {
        return this.getChildren(selector)[0];
    }

    getChildren(selector) {
        let children = this._browser.elementIdElements(this.webElementId, selector);
        return DomNode.webElementsToDomNode(this._browser, children);
    }

    getPositionInPage() {
        return this._browser.elementIdLocation(this.webElementId);
    }

    getPositionInView() {
        return this._browser.elementIdLocationInView(this.webElementId);
    }

    getTagname() {
        return this._browser.elementIdName(this.webElementId);
    }

    getRectangle() {
        return this._browser.elementIdRect(this.webElementId);
    }

    /**
     * @returns The screenshot as a base64 encoded PNG.
     */
    getScreenshot() {
        return this._browser.elementIdScreenshot(this.webElementId);
    }

    isSelected() {
        return this._browser.elementIdSelected(this.webElementId);
    }

    clear() {
        this._browser.elementIdClear(this.webElementId);
        return this;
    }

    sendKeys(keys) {
        this._browser.elementIdValue(this.webElementId, keys);
        return this;
    }

    getText(unaltered) {
        let text = this._browser.elementIdText(this.webElementId).value;
        return unaltered ? text : text.trim();
    }

    waitTillLoaded(){
        let me = this;
        me._browser.waitUntil(
            () => {return me._browser.elementIdDisplayed(me.webElementId).value;},
            LOADING_TIMEOUT,
            TIMEOUT_MESSAGE,
            LOADING_CHECK_INTERVAL
        );
    }

    static webElementsToDomNode(_browser, elements) {
        return elements.value.map(function(elem) {
            return new DomNode(_browser, elem.ELEMENT);
        });
    }
}

module.exports = DomNode;