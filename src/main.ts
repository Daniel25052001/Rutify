// src/main.ts
import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { PrismaExceptionFilter } from './common/filters/prisma-exception.filter';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Habilitar CORS para permitir la comunicación segura con el frontend (puerto 5173)
  app.enableCors();

  // Validación global de DTOs
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: false,
      transform: true,
    }),
  );

  // Registro del filtro global de Prisma
  const { httpAdapter } = app.get(HttpAdapterHost);
  app.useGlobalFilters(new PrismaExceptionFilter(httpAdapter));

  // Configuración de Swagger / OpenAPI
  const config = new DocumentBuilder()
    .setTitle('Rutify API - Sistema de Transporte Intermunicipal')
    .setDescription(
      'Documentación interactiva de la API RESTful de Rutify. Permite gestionar autenticación, autobuses, rutas, programación de viajes y reserva de boletos.',
    )
    .setVersion('1.0.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'Authorization',
        description: 'Ingrese el token JWT con el prefijo Bearer (Ejemplo: "Bearer eyJhbGciOi...")',
        in: 'header',
      },
      'JWT-auth',
    )
    .addTag('Auth', 'Endpoints de autenticación y control de acceso de usuarios')
    .addTag('Buses', 'Gestión del parque automotor y capacidad de autobuses')
    .addTag('Routes', 'Administración de trayectos, orígenes, destinos y tarifas')
    .addTag('Trips', 'Programación y disponibilidad de viajes')
    .addTag('Tickets', 'Reserva, consulta y cambio de estado de boletos')
    .addTag('General', 'Endpoints de estado general del servicio')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  });

  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`Rutify API corriendo en: http://localhost:${port}`);
  console.log(`Swagger UI disponible en: http://localhost:${port}/api/docs`);
}
bootstrap();