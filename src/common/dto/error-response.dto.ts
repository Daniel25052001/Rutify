import { ApiProperty } from '@nestjs/swagger';

export class HttpErrorResponseDto {
  @ApiProperty({ example: 400, description: 'Código de estado HTTP del error' })
  statusCode: number;

  @ApiProperty({
    example: 'El correo electrónico no es válido',
    description: 'Descripción del error o lista de fallos de validación',
    oneOf: [{ type: 'string' }, { type: 'array', items: { type: 'string' } }],
  })
  message: string | string[];

  @ApiProperty({ example: 'Bad Request', description: 'Nombre descriptivo del error HTTP o código Prisma', required: false })
  error?: string;
}
