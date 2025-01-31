import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger('HTTP');

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const { method, originalUrl, body, params, query } = request;
    const timestamp = Date.now();

    this.logger.log(
      `Incoming Request - Method: ${method}, URL: ${originalUrl}, Params: ${JSON.stringify(
        params,
      )}, Query: ${JSON.stringify(query)}, Body: ${JSON.stringify(body)}`,
    );

    return next.handle().pipe(
      tap(() => {
        const duration = Date.now() - timestamp;
        this.logger.log(
          `Request completed - Method: ${method}, URL: ${originalUrl}, Duration: ${duration}ms`,
        );
      }),
    );
  }
}
