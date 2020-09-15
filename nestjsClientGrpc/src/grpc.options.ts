import { ClientOptions, ClientProviderOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';

export const microserviceOptions: ClientOptions = {
  transport: Transport.GRPC,
  options: {
    url: "127.0.0.1:50051",
    package: 'app',
    protoPath: join(__dirname, '../src/proto/app.proto'),
  },
};

export const logMicroserviceOptions: ClientOptions = {
  transport: Transport.GRPC,
  options: {
    url: "127.0.0.1:50052",
    package: 'log',
    protoPath: join(__dirname, '../src/proto/log.proto'),
  },
};

export const queueMicroserviceOptions: ClientOptions = {
  transport: Transport.RMQ,
  options: {
    urls: ["amqp://guest:guest@localhost:5672/"],
    queue: "microservice_event",
    queueOptions: { durable: false },
  },
}

export const queueProviderOptions: ClientProviderOptions = {
  ...queueMicroserviceOptions,
  name: "QUEUE_MODULE_NAME"
}