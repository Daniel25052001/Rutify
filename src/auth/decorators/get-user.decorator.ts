import { createParamDecorator, ExecutionContext, InternalServerErrorException } from '@nestjs/common';

export const GetUser = createParamDecorator(
    (data: string | undefined, ctx: ExecutionContext) => {
        const request = ctx.switchToHttp().getRequest();
        const user = request.user;

        if (!user) {
            throw new InternalServerErrorException('Usuario no encontrado en la petición (asegúrate de usar JwtAuthGuard)');
        }

        return data ? user[data] : user;
    },
);