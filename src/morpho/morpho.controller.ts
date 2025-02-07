// External dependencies
import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

// Services
import { MorphoService } from './morpho.service';

@ApiTags('morpho')
@Controller('beta/v0/morpho')
export class MorphoController {
  constructor(private readonly morphoService: MorphoService) {}
}
