import { Test, TestingModule } from '@nestjs/testing';
import { RoutesService } from './routes.service';
import { PrismaService } from '../prisma/prisma.service';

describe('RoutesService (Unit)', () => {
    let service: RoutesService;
    let prismaService: PrismaService;

    const mockPrismaService = {
        route: {
            findMany: jest.fn().mockResolvedValue([
                { id: 'uuid-route-1', origin: 'Medellín', destination: 'Bogotá', duration: 480 },
            ]),
            create: jest.fn().mockImplementation((dto) => Promise.resolve({ id: 'uuid-route-new', ...dto.data })),
        },
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                RoutesService,
                { provide: PrismaService, useValue: mockPrismaService },
            ],
        }).compile();

        service = module.get<RoutesService>(RoutesService);
        prismaService = module.get<PrismaService>(PrismaService);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('debe estar definido el servicio de rutas', () => {
        expect(service).toBeDefined();
    });

    it('debe retornar una lista de rutas disponibles', async () => {
        const mockUser = { role: 'COMPANY_ADMIN', companyId: 'company-uuid-1' };
        const routes = await service.findAll(mockUser as any);
        expect(routes).toHaveLength(1);
        expect(routes[0].origin).toEqual('Medellín');
        expect(prismaService.route.findMany).toHaveBeenCalledTimes(1);
    });
});