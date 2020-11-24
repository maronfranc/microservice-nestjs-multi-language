import { Body, Controller, Inject, OnModuleInit, Post, Req, Res, UseFilters } from '@nestjs/common';
import { Client, ClientGrpc, ClientProxy, MessagePattern } from '@nestjs/microservices';
import { Request, Response } from "express";
import { timeout } from "rxjs/operators";
import { IGrpcLogService, IGrpcRustService, IGrpcService } from './grpc.interface';
import { logMicroserviceOptions, microserviceOptions, QUEUE_CLIENT_MODULE_NAME, rustMicroserviceOptions } from './grpc.options';
import { ExceptionFilter } from './rpc-exception.filter';

const FIVE_SECONDS = 5000;

@Controller()
export class AppController implements OnModuleInit {
  public constructor(@Inject(QUEUE_CLIENT_MODULE_NAME) private readonly queueClient: ClientProxy) { }

  @Client(microserviceOptions)
  private client: ClientGrpc;
  private grpcService: IGrpcService;

  @Client(logMicroserviceOptions)
  private logClient: ClientGrpc;
  private grpcLogService: IGrpcLogService;

  @Client(rustMicroserviceOptions)
  private rustClient: ClientGrpc;
  private grpcRustService: IGrpcRustService;

  onModuleInit() {
    this.grpcService = this.client.getService<IGrpcService>('AppController');
    this.grpcLogService = this.logClient.getService<IGrpcLogService>('LogController');
    this.grpcRustService = this.rustClient.getService<IGrpcRustService>('FibonacciService');
  }

  @UseFilters(new ExceptionFilter())
  @Post('add')
  async logObservable(@Body('data') data: number[], @Req() req: Request, @Res() res: Response) {
    const nestjsQueueResponse$ = this.queueClient.emit("notify-event-pattern", {
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

  @UseFilters(new ExceptionFilter())
  @Post('fibonacci')
  public async getFibonacci(@Body("number") number: number, @Res() res: Response): Promise<void> {
    const response$ = this.grpcRustService.calc({ number });
    response$.pipe(timeout(FIVE_SECONDS)).subscribe(
      (value) => res.send(value),
      (error) => console.error(error),
      () => console.info('Microservice fibonacci request completed')
    );
  }

  @MessagePattern("notify-event-pattern")
  public async eventHandler(data: Record<string, unknown>): Promise<void> {
    console.log(" ----- ----- |-Message event-| ----- ----- ");
    console.log(data)
  }
}
