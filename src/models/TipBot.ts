import puppeteer, { Page, PuppeteerNode } from "puppeteer";

class TipBot {
    #pup: PuppeteerNode;
    #urls: Array<string>;

    constructor(urls: Array<string>) {
        this.#urls = urls;
        this.#pup = puppeteer;
    }
    async launch(): Promise<Page> {
        const browser = await this.#pup.launch({ headless: false });
        const page = await browser.newPage();

        return page;
    }
    async getAnswers() {}

    get urls() {
        return this.#urls;
    }
}
export { TipBot };
