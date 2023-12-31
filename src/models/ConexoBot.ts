import { Page } from 'puppeteer';
import { TipBot } from './TipBot';
import { Injectable } from '@nestjs/common';

type ConexoGroups = {
  number: number;
  theme: string;
  words: Array<string>;
};
type ConexoResponse = {
  [key: string]: {
    groups: Array<ConexoGroups>;
    startingBoard: Array<string>;
  };
};

export class ConexoBot extends TipBot {
  #answerGroup: Array<ConexoGroups>;

  constructor(urls: Array<string>) {
    super(urls);
  }
  async run(): Promise<void> {
    const page = await this.launch();

    await page.goto(this.urls[0]);

    const selector = '.board-item > div > div';

    const item = await page.waitForSelector(selector);

    const text = await item?.evaluate((e) => e.innerHTML);
    await page.reload();

    this.answerGroup = await this.InteceptResponse(page, text);

    await page.close();
  }
  private async InteceptResponse(page: Page, text: string | undefined) {
    let group: Array<ConexoGroups>;
    page.on('response', async (response) => {
      const url = 'https://conexo.ws/game-specs.json';
      if (response.url() == url) {
        const res: ConexoResponse = await response.json();
        let groupid = this.iterateOverResponse(res, text);
        group = res[groupid].groups;
      }
    });
    return group;
  }
  private iterateOverResponse(res: ConexoResponse, text: string | undefined) {
    let id = '';
    for (const key in res) {
      const { startingBoard } = res[key];

      startingBoard.forEach((e: string) => {
        if (e === text) {
          id = key;
          return;
        }
      });
    }
    return id;
  }
  get answerGroup() {
    return this.#answerGroup;
  }
  set answerGroup(answerGroup: Array<ConexoGroups>) {
    this.#answerGroup = answerGroup;
  }
}
