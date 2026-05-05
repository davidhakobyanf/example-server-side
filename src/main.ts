import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const port = Number(process.env.PORT ?? 5001);

  app.use(cookieParser());
  app.enableCors({
    origin:[process.env.CLIENT_URL],
    credentials: true,
    exposedHeaders:'set-cookie'
  })
  
  await app.listen(port);
}
bootstrap();
