import { Body, Controller, OnModuleInit, Post, Req, Res, UseFilters } from '@nestjs/common';
import { Client, ClientGrpc } from '@nestjs/microservices';
import { Request, Response } from "express";
import { timeout } from "rxjs/operators";
import { IGrpcLogService, IGrpcService } from './grpc.interface';
import { logMicroserviceOptions, microserviceOptions } from './grpc.options';
import { ExceptionFilter } from './rpc-exception.filter';

const FIVE_SECONDS = 5000;

@Controller()
export class AppController implements OnModuleInit {
  @Client(microserviceOptions)
  private client: ClientGrpc;
  private grpcService: IGrpcService;

  @Client(logMicroserviceOptions)
  private logClient: ClientGrpc;
  private grpcLogService: IGrpcLogService;

  onModuleInit() {
    this.grpcService = this.client.getService<IGrpcService>('AppController');
    this.grpcLogService = this.logClient.getService<IGrpcLogService>('LogController');
  }

  @UseFilters(new ExceptionFilter())
  @Post('add')
  async logObservable(@Body('data') data: number[], @Req() req: Request, @Res() res: Response) {
    const logData = {
      username: "username user",
      query: JSON.stringify(req.query),
      url: req.url,
      datetime: new Date().toISOString()
    }
    const logResponse$ = this.grpcLogService.saveLog(logData);
    void logResponse$.toPromise();

    const response$ = this.grpcService.accumulate({ data });
    response$.pipe(timeout(FIVE_SECONDS)).subscribe(
      (value) => res.send(value),
      (error) => console.log(error),
      () => console.log('Microservice request completed')
    );
  }
}
