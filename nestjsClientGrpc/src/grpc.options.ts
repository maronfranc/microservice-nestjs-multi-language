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

export const rustMicroserviceOptions: ClientOptions = {
  transport: Transport.GRPC,
  options: {
    url: "127.0.0.1:50053",
    package: 'fibonacci',
    protoPath: join(__dirname, '../src/proto/fibonacci.proto'),
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

export const QUEUE_CLIENT_MODULE_NAME = "QUEUE_CLIENT_MODULE_NAME"
export const queueProviderOptions: ClientProviderOptions = {
  ...queueMicroserviceOptions,
  name: QUEUE_CLIENT_MODULE_NAME
}