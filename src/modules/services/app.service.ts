import { Injectable } from '@nestjs/common';
import { ArtigoBot } from 'src/models/ArtigoBot';
import { ConexoBot } from 'src/models/ConexoBot';
import { TermoBot } from 'src/models/TermoBot';

@Injectable()
export class AppService {
  async buildAnswer() {
    const artigoBot = new ArtigoBot(['https://artigo.app/']);
    const conexoBot = new ConexoBot(['https://conexo.ws/daily']);
    const termoBot = new TermoBot([
      'https://term.ooo/',
      'https://term.ooo/2/',
      'https://term.ooo/4/',
    ]);

    await termoBot.run();
    await artigoBot.run();
    await conexoBot.run();

    return {
      termo: termoBot.answers,
      artigo: artigoBot.article,
      conexo: conexoBot.answerGroup,
    };
  }
}
