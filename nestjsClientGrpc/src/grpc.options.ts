import { ClientOptions, Transport } from '@nestjs/microservices';
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
