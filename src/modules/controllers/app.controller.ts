import { Controller, Get, Inject, Render } from '@nestjs/common';
import { AppService } from '../services/app.service';

@Controller()
export class AppController {
  @Inject(AppService)
  private readonly service: AppService;

  @Get()
  @Render('index')
  async root() {
    console.log(await this.service.buildAnswer());
    return this.service.buildAnswer();
  }
}
