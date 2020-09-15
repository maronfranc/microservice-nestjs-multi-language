import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { queueMicroserviceOptions } from './grpc.options';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  app.connectMicroservice(queueMicroserviceOptions);
  await app.startAllMicroservicesAsync();

  await app.listen(3001);
}
bootstrap();
