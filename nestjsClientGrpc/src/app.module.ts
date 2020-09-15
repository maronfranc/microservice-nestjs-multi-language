import { Module } from '@nestjs/common';
import { ClientsModule } from '@nestjs/microservices';
import { AppController } from './app.controller';
import { queueProviderOptions } from './grpc.options';

@Module({
  imports: [ClientsModule.register([queueProviderOptions])],
  controllers: [AppController],
  providers: [],
})
export class AppModule { }
