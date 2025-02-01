import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { NO_LOGGING_KEY } from '../decorators/no-logging.decorator';
import { Reflector } from '@nestjs/core';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger('HTTP');

  constructor(private reflector: Reflector) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const shouldSkipLogging = this.reflector.get<boolean>(
      NO_LOGGING_KEY,
      context.getHandler(),
    );

    if (shouldSkipLogging) {
      return next.handle();
    }

    const request = context.switchToHttp().getRequest();
    const { method, url } = request;
    const now = Date.now();

    return next.handle().pipe(
      tap(() => {
        const delay = Date.now() - now;
        this.logger.log(`${method} ${url} ${delay}ms`);
      }),
    );
  }
}
