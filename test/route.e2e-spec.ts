// Importa las utilidades necesarias de NestJS para configurar el módulo de pruebas y la aplicación.
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
// Importa supertest para realizar peticiones HTTP simuladas contra el servidor de pruebas.
import request from 'supertest';
// Importa el módulo raíz de la aplicación para levantar el contexto completo del backend.
import { AppModule } from './../src/app.module';

// Define el bloque de pruebas End-to-End (E2E) para verificar las rutas del módulo de rutas de transporte (Route).
describe('Route Management (e2e)', () => {
    let app: INestApplication;

    // Configuración inicial que se ejecuta una sola vez antes de todas las pruebas del bloque.
    beforeAll(async () => {
        // Crea un módulo de prueba compilando el módulo raíz de la aplicación.
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        // Inicializa la instancia de la aplicación NestJS en un entorno virtual.
        app = moduleFixture.createNestApplication();

        // Configura de forma global los tubos de validación para respetar los decoradores y DTOs del módulo.
        app.useGlobalPipes(new ValidationPipe());

        // Inicia la aplicación de forma asíncrona para que comience a escuchar peticiones internas de prueba.
        await app.init();
    });

    // Prueba E2E para verificar que el endpoint de obtención de rutas permita el acceso público o exija token según corresponda.
    it('/routes (GET) - Debe responder de forma correcta a la consulta general de rutas', () => {
        // Realiza una petición GET simulada al recurso de rutas.
        return request(app.getHttpServer())
            .get('/routes')
            .expect((res) => {
                // Valida que el código de estado retornado sea el esperado (por ejemplo, 200 OK o 401 si requiere auth estricta).
                expect([200, 401]).toContain(res.status);
            });
    });

    // Prueba E2E para verificar que la creación de una ruta exija autenticación y un payload válido.
    it('/routes (POST) - Debe denegar el acceso a la creación de rutas sin un token válido', () => {
        // Realiza una petición POST simulada al endpoint de creación de rutas sin incluir credenciales.
        return request(app.getHttpServer())
            .post('/routes')
            .send({ origin: 'Medellín', destination: 'Bogotá', estimatedDuration: 480 })
            .expect(401); // Espera un código HTTP 401 Unauthorized por falta de autenticación.
    });

    // Limpieza que se ejecuta al finalizar todas las pruebas para cerrar correctamente la conexión del servidor.
    afterAll(async () => {
        await app.close();
    });
});