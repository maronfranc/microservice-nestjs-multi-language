import { Body, Controller, Inject, OnModuleInit, Post, Req, Res, UseFilters } from '@nestjs/common';
import { Client, ClientGrpc, ClientProxy } from '@nestjs/microservices';
import { Request, Response } from "express";
import { timeout } from "rxjs/operators";
import { IGrpcLogService, IGrpcService } from './grpc.interface';
import { logMicroserviceOptions, microserviceOptions } from './grpc.options';
import { ExceptionFilter } from './rpc-exception.filter';

const FIVE_SECONDS = 5000;

@Controller()
export class AppController implements OnModuleInit {
  public constructor(@Inject("QUEUE_MODULE_NAME") private readonly queueClient: ClientProxy) {}

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
    const nestjsQueueResponse$ = this.queueClient.emit("Emit pattern from Nestjs", {
      text: "Message from Nestjs",
      date: new Date()
    });
    void nestjsQueueResponse$.toPromise();

    const logData = {
      username: "Nestjs User",
      query: JSON.stringify(req.query),
      url: req.url,
      datetime: new Date().toISOString()
    }
    const logResponse$ = this.grpcLogService.saveLog(logData);
    const logResponse = await logResponse$.toPromise();
    console.info("Python response:", logResponse);

    const response$ = this.grpcService.accumulate({ data });
    response$.pipe(timeout(FIVE_SECONDS)).subscribe(
      (value) => res.send(value),
      (error) => console.error(error),
      () => console.info('Microservice accumulate request completed')
    );
  }
}
