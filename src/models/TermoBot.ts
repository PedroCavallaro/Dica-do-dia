import { Page } from 'puppeteer';
import { TipBot } from './TipBot';
import { TERMO } from '../enums/TermoEnum';
import { LocalStorageFormat } from '../@types/types';
import { Injectable } from '@nestjs/common';

export class TermoBot extends TipBot {
  #answers = new Map();
  #urls = ['https://term.ooo/', 'https://term.ooo/2/', 'https://term.ooo/4/'];
  constructor(urls: Array<string>) {
    super(urls);
  }
  async run(): Promise<void> {
    const page1 = await this.launch();
    const page2 = await this.launch();
    const page3 = await this.launch();

    await Promise.all([
      this.goToAndGetAnswer(page1, this.urls[0], TERMO.termo),
      this.goToAndGetAnswer(page2, this.urls[1], TERMO.dueto),
      this.goToAndGetAnswer(page3, this.urls[2], TERMO.quarteto),
    ]);
    await page1.close();
    await page2.close();
    await page3.close();
  }

  async goToAndGetAnswer(page: Page, url: string, identifier: string) {
    await page.goto(url);
    await this.clearPopUp(page);
    await this.typeGenericWord(page);
    await this.getAnswerGeneric(page, identifier);
  }

  async clearPopUp(page: Page) {
    const searchResultSelector = 'body';
    await page.waitForSelector(searchResultSelector);
    await page.click(searchResultSelector);
  }

  async typeGenericWord(page: Page) {
    await page.keyboard.type('Audio', { delay: 100 });
    await page.keyboard.press('Enter');
  }

  async retrieveItemFromLs(page: Page, key: string) {
    const ls: LocalStorageFormat = await page.evaluate((key) => {
      return {
        answer: JSON.parse(localStorage.getItem(key)!),
      };
    }, key);

    return ls;
  }

  async getAnswerGeneric(page: Page, gameIdentifier: string) {
    return new Promise((resolve) => {
      setTimeout(async () => {
        const localStorage = await this.retrieveItemFromLs(
          page,
          gameIdentifier,
        );
        const { answer } = localStorage;

        resolve(
          this.#answers.set(
            gameIdentifier,
            answer.state.map((e) => e.solution),
          ),
        );
      }, 3000);
    });
  }
  get answers() {
    return this.#answers;
  }
}
