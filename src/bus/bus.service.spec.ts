// Importa las utilidades de testing de NestJS.
import { Test, TestingModule } from '@nestjs/testing';
// Importa el servicio de buses del módulo correspondiente.
import { BusesService } from './bus.service';
// Importa PrismaService para el mock de persistencia.
import { PrismaService } from '../prisma/prisma.service';

// Define el bloque de pruebas unitarias para el servicio de autobuses.
describe('BusesService (Unit)', () => {
    let service: BusesService;
    let prismaService: PrismaService;

    // Mock simulado de PrismaService utilizando 'plate' según el esquema real.
    const mockPrismaService = {
        bus: {
            findMany: jest.fn().mockResolvedValue([
                { id: 'uuid-bus-1', plate: 'XYZ-123', capacity: 40 },
            ]),
            create: jest.fn().mockImplementation((dto) => Promise.resolve({ id: 'uuid-bus-new', ...dto.data })),
        },
    };

    // Configuración previa antes de ejecutar cada prueba unitaria.
    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                BusesService,
                { provide: PrismaService, useValue: mockPrismaService },
            ],
        }).compile();

        service = module.get<BusesService>(BusesService);
        prismaService = module.get<PrismaService>(PrismaService);
    });

    // Limpia los mocks después de cada prueba.
    afterEach(() => {
        jest.clearAllMocks();
    });

    // Valida que el servicio esté correctamente instanciado.
    it('debe estar definido el servicio de buses', () => {
        expect(service).toBeDefined();
    });

    // Prueba unitaria utilizando la propiedad 'plate' correcta y pasando el objeto de usuario requerido.
    it('debe retornar una lista de autobuses registrados', async () => {
        const mockUser = { role: 'COMPANY_ADMIN', companyId: 'company-uuid-1' };
        const buses = await service.findAll(mockUser as any);
        expect(buses).toHaveLength(1);
        expect(buses[0].plate).toEqual('XYZ-123');
        expect(prismaService.bus.findMany).toHaveBeenCalledTimes(1);
    });
});