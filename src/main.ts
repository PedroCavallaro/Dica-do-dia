import { NestFactory } from '@nestjs/core';
import { AppModule } from './modules/app.module';
import { join, resolve } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.useStaticAssets(resolve('./public'));
  app.setBaseViewsDir(resolve('./views'));
  app.setViewEngine('hbs');

  await app.listen(3000);
}
bootstrap();
