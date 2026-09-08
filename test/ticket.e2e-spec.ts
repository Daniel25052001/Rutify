import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from './../src/app.module';

// Define el bloque de pruebas End-to-End (E2E) para la gestión de boletos y seguridad de endpoints.
describe('Ticket Management (e2e)', () => {
    let app: INestApplication;

    // Configuración inicial que se ejecuta una sola vez antes de todas las pruebas del bloque.
    beforeAll(async () => {
        // Crea un módulo de prueba compilando el módulo raíz de la aplicación.
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        // Inicializa la instancia de la aplicación NestJS en un entorno virtual.
        app = moduleFixture.createNestApplication();

        // Configura de forma global los tubos de validación (ValidationPipe) para respetar las reglas de los DTOs.
        app.useGlobalPipes(new ValidationPipe());

        // Inicia la aplicación de forma asíncrona para que comience a escuchar peticiones internas de prueba.
        await app.init();
    });

    // Prueba unitaria/E2E para validar que los endpoints protegidos rechacen peticiones sin token de autenticación.
    it('/tickets (POST) - Debe denegar el acceso a solicitudes sin token Bearer', () => {
        // Realiza una petición POST simulada al endpoint de creación de tickets sin incluir la cabecera de autorización.
        return request(app.getHttpServer())
            .post('/tickets')
            .send({ seatNumber: 12, tripId: 'test-trip-uuid' })
            .expect(401); // Espera un código de estado HTTP 401 (Unauthorized) debido a la ausencia del JWT.
    });

    // Limpieza que se ejecuta al finalizar todas las pruebas para cerrar correctamente la conexión del servidor.
    afterAll(async () => {
        await app.close();
    });
});