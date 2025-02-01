import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AppService } from './app.service';
import { NoLogging } from './common/decorators/no-logging.decorator';

@ApiTags('health')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @NoLogging()
  @ApiOperation({ summary: 'Health check endpoint' })
  @ApiResponse({
    status: 200,
    description: 'Returns a welcome message indicating the API is running',
    schema: {
      type: 'string',
      example: 'Welcome to Ionic API v2! 🌊',
    },
  })
  getHello(): string {
    return this.appService.getHello();
  }
}
