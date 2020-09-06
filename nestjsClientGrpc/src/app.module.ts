import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AppController } from './app.controller';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: "QUEUE_MODULE_NAME",
        transport: Transport.RMQ,
        options: {
          urls: ["amqp://guest:guest@localhost:5672/"],
          queue: 'microservice_queue',
          queueOptions: {
            durable: true
          },
        },
      },
    ]),
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}

