import { Observable } from 'rxjs';

export interface IGrpcService {
  accumulate(numberArray: INumberArray): Observable<any>;
}

interface INumberArray {
  data: number[];
}

export interface IGrpcLogService {
  saveLog(logData: ILogData): Observable<any>;
}

interface ILogData {
  username: string;
  url: string;
  query: string;
  datetime: string;
}

export interface IGrpcRustService {
  calc(number: NumberRequest): Observable<FibonacciResponse>;
}

interface NumberRequest {
  number: number;
}
interface FibonacciResponse {
  fibonacci: number;
}