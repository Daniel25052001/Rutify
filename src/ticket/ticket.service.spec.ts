import { Test, TestingModule } from '@nestjs/testing';
import { TicketsService } from './ticket.service';
import { PrismaService } from '../prisma/prisma.service';

describe('TicketService (Unit)', () => {
    let service: TicketsService;
    let prismaService: PrismaService;

    const mockPrismaService = {
        ticket: {
            findMany: jest.fn().mockResolvedValue([
                { id: 'uuid-ticket-1', seatNumber: 12, passengerName: 'Juan Pérez', price: 50.0 },
            ]),
            create: jest.fn().mockImplementation((dto) => Promise.resolve({ id: 'uuid-ticket-new', ...dto.data })),
        },
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                TicketsService,
                { provide: PrismaService, useValue: mockPrismaService },
            ],
        }).compile();

        service = module.get<TicketsService>(TicketsService);
        prismaService = module.get<PrismaService>(PrismaService);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('debe estar definido el servicio de tiquetes', () => {
        expect(service).toBeDefined();
    });

    it('debe retornar una lista de tiquetes por usuario', async () => {
        const userId = 'user-uuid-1';
        const tickets = await service.findAllByUser(userId);
        expect(tickets).toHaveLength(1);
        expect(tickets[0].id).toEqual('uuid-ticket-1');
        expect(prismaService.ticket.findMany).toHaveBeenCalledTimes(1);
    });
});