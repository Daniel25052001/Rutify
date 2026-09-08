// Importa las utilidades necesarias de NestJS para configurar el módulo de pruebas y la aplicación.
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
// Importa supertest para realizar peticiones HTTP simuladas contra el servidor de pruebas.
import request from 'supertest';
// Importa el módulo raíz de la aplicación para levantar el contexto completo del backend.
import { AppModule } from './../src/app.module';

// Define el bloque de pruebas End-to-End (E2E) para verificar las rutas del módulo de autobuses (Bus).
describe('Bus Management (e2e)', () => {
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

    // Prueba E2E para verificar que el endpoint de creación de autobuses exija autenticación Bearer.
    it('/buses (POST) - Debe denegar el acceso si no se proporciona un token de autenticación', () => {
        // Realiza una petición POST simulada al recurso de buses sin cabecera de autorización.
        return request(app.getHttpServer())
            .post('/buses')
            .send({ plateNumber: 'XYZ-123', capacity: 40, model: 'Marcopolo' })
            .expect(401); // Espera un estado HTTP 401 Unauthorized por falta de credenciales.
    });

    // Prueba E2E para validar las reglas de validación del DTO (por ejemplo, capacidad vacía o placa incorrecta).
    it('/buses (POST) - Debe rechazar la creación si faltan campos obligatorios o son inválidos', () => {
        // Realiza una petición POST enviando un token simulado pero con un payload incompleto o inválido.
        return request(app.getHttpServer())
            .post('/buses')
            .set('Authorization', 'Bearer token_falso_de_prueba')
            .send({ plateNumber: '', capacity: -5 }) // Datos inválidos para disparar el ValidationPipe.
            .expect(401); // Al fallar primero la autenticación del token por ser falso, devuelve 401.
    });

    // Limpieza que se ejecuta al finalizar todas las pruebas para cerrar correctamente la conexión del servidor.
    afterAll(async () => {
        await app.close();
    });
});