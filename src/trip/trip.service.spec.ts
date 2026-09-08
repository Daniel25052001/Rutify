// Importa las utilidades de testing de NestJS.
import { Test, TestingModule } from '@nestjs/testing';
// Importa el servicio que deseas probar de forma aislada.
import { TripsService } from './trip.service';
// Importa PrismaService o el proveedor de persistencia correspondiente.
import { PrismaService } from '../prisma/prisma.service';

// Define el bloque de pruebas unitarias para el servicio de viajes.
describe('TripsService (Unit)', () => {
    let service: TripsService;
    let prismaService: PrismaService;

    // Mock simulado de PrismaService para evitar conexiones reales a la base de datos durante las pruebas unitarias.
    const mockPrismaService = {
        trip: {
            findMany: jest.fn().mockResolvedValue([
                { id: 'uuid-trip-1', busId: 'bus-1', routeId: 'route-1', departureTime: new Date() },
            ]),
            create: jest.fn().mockImplementation((dto) => Promise.resolve({ id: 'uuid-new', ...dto.data })),
        },
    };

    // Configuración previa antes de ejecutar cada prueba unitaria.
    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                TripsService,
                { provide: PrismaService, useValue: mockPrismaService },
            ],
        }).compile();

        service = module.get<TripsService>(TripsService);
        prismaService = module.get<PrismaService>(PrismaService);
    });

    // Limpia los mocks después de cada prueba.
    afterEach(() => {
        jest.clearAllMocks();
    });

    // Valida que el servicio esté correctamente instanciado.
    it('debe estar definido el servicio de viajes', () => {
        expect(service).toBeDefined();
    });

    // Prueba unitaria para comprobar la recuperación de datos mediante el mock de Prisma.
    it('debe retornar una lista de viajes programados', async () => {
        const trips = await service.findAllByCompany('company-1');
        expect(trips).toHaveLength(1);
        expect(trips[0].id).toEqual('uuid-trip-1');
        expect(prismaService.trip.findMany).toHaveBeenCalledTimes(1);
    });
});
