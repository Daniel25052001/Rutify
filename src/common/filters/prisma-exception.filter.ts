import { ArgumentsHost, Catch, ConflictException, NotFoundException, BadRequestException } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { Prisma } from '@prisma/client';
import { Response } from 'express';

@Catch(Prisma.PrismaClientKnownRequestError)
export class PrismaExceptionFilter extends BaseExceptionFilter {
    catch(exception: Prisma.PrismaClientKnownRequestError, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const statusCode = this.mapPrismaErrorToStatus(exception.code);

        let message = 'Database error occurred';
        if (exception.code === 'P2002') {
            message = `Unique constraint failed on the fields: ${(exception.meta?.target as string[])?.join(', ') || 'unknown'}`;
        } else if (exception.code === 'P2003') {
            message = 'Foreign key constraint failed. Related record does not exist.';
        } else if (exception.code === 'P2025') {
            message = 'Record to update or delete does not exist.';
        }

        response.status(statusCode).json({
            statusCode,
            message,
            error: exception.code,
        });
    }

    private mapPrismaErrorToStatus(code: string): number {
        switch (code) {
            case 'P2002':
                return 409; // Conflict
            case 'P2025':
            case 'P2003':
                return 404; // Not Found / Bad Request contextually
            default:
                return 400; // Bad Request
        }
    }
}