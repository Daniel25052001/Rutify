// Importa las utilidades necesarias de NestJS para configurar el módulo de pruebas y la aplicación.
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
// Importa supertest para realizar peticiones HTTP simuladas contra el servidor de pruebas.
import request from 'supertest';
// Importa el módulo raíz de la aplicación para levantar el contexto completo del backend.
import { AppModule } from './../src/app.module';

// Define el bloque de pruebas End-to-End (E2E) para verificar los endpoints del módulo de viajes (Trip).
describe('Trip Management (e2e)', () => {
    let app: INestApplication;

    // Configuración inicial que se ejecuta una sola vez antes de todas las pruebas del bloque.
    beforeAll(async () => {
        // Crea un módulo de prueba compilando el módulo raíz de la aplicación.
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        // Inicializa la instancia de la aplicación NestJS en un entorno virtual.
        app = moduleFixture.createNestApplication();

        // Configura de forma global los tubos de validación para respetar los DTOs y decoradores.
        app.useGlobalPipes(new ValidationPipe());

        // Inicia la aplicación de forma asíncrona para que comience a escuchar peticiones internas de prueba.
        await app.init();
    });

    // Prueba E2E para verificar que la consulta general de viajes responda adecuadamente.
    it('/trips (GET) - Debe permitir consultar los viajes programados o requerir autenticación', () => {
        // Realiza una petición GET simulada al recurso de viajes.
        return request(app.getHttpServer())
            .get('/trips')
            .expect((res) => {
                // Valida que la respuesta devuelva un estado exitoso o de control de acceso válido.
                expect([200, 401]).toContain(res.status);
            });
    });

    // Prueba E2E para verificar que el endpoint de programación de viajes proteja su escritura mediante tokens.
    it('/trips (POST) - Debe denegar la creación de un viaje si no se incluye un token de autorización', () => {
        // Realiza una petición POST simulada enviando datos de un nuevo viaje sin cabecera Bearer.
        return request(app.getHttpServer())
            .post('/trips')
            .send({ busId: 'test-bus-uuid', routeId: 'test-route-uuid', departureTime: new Date().toISOString() })
            .expect(401); // Espera un código HTTP 401 Unauthorized por falta de autenticación.
    });

    // Limpieza que se ejecuta al finalizar todas las pruebas para cerrar correctamente la conexión del servidor.
    afterAll(async () => {
        await app.close();
    });
});