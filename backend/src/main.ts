import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.enableCors();
  // Раздача статических файлов из папки uploads
  app.useStaticAssets(join(__dirname, '..', 'uploads'), { prefix: '/uploads/' });
  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`Server is running on http://localhost:${port}`);
}
bootstrap();
