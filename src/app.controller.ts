import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AppService } from './app.service';

@ApiTags('General')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Get()
  @ApiOperation({
    summary: 'Comprobar estado del servicio',
    description: 'Endpoint raíz de salud/bienvenida que confirma que la API se encuentra en ejecución.',
  })
  @ApiResponse({
    status: 200,
    description: 'Servicio operativo.',
    schema: {
      type: 'string',
      example: 'Hello World!',
    },
  })
  getHello(): string {
    return this.appService.getHello();
  }
}
