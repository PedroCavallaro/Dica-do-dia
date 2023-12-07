import { Injectable } from '@nestjs/common';
import { Article } from '../@types/types';
import { TipBot } from './TipBot';

export class ArtigoBot extends TipBot {
  #article: string;
  constructor(urls: Array<string>) {
    super(urls);
  }

  async run(): Promise<void> {
    const page = await this.launch();

    page.on('response', async (response) => {
      if (response.url() == 'https://artigo.app/articles/daily') {
        const res: Array<{ number: number }> = await response.json();
        const lastArticleNumber = res[0].number;

        const article = await this.getArticleOfTheDay(lastArticleNumber);

        this.#article = article;
      }
    });

    await page.goto('https://artigo.app');

    await page.close();
  }
  async getArticleOfTheDay(lastArticleNumber: number) {
    const articleReq = await fetch(
      `https://artigo.app/articles/daily/${lastArticleNumber}`,
    );

    const articleResponse: Article = await articleReq.json();
    return articleResponse.title;
  }
  set article(article: string) {
    this.#article = article;
  }
  get article() {
    return this.#article;
  }
}
