import { Controller, Get, Query } from '@nestjs/common';
import { AuditService } from './super-admin-audit.service';

@Controller('admin/audit-logs')
export class AuditController {
    constructor(private readonly auditService: AuditService) { }

    @Get()
    getAllLogs(@Query('action') action?: string) {
        return this.auditService.getAllLogs(action);
    }
}