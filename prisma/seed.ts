import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import * as bcrypt from 'bcrypt';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
    // 1. Crear o verificar la Compañía de prueba
    let company = await prisma.company.findUnique({
        where: { nit: '900999999-1' },
    });

    if (!company) {
        company = await prisma.company.create({
            data: {
                name: 'Rutify Central Express',
                nit: '900999999-1',
                phone: '3100000000',
            },
        });
        console.log(`[Seed]: Compañía creada con ID: ${company.id}`);
    }

    // 2. Crear o verificar el Super Admin
    const emailRoot = 'SuperRutify@gmail.com';
    const existingAdmin = await prisma.user.findUnique({
        where: { email: emailRoot },
    });

    if (!existingAdmin) {
        const hashedPassword = await bcrypt.hash('RutifyMasterSecure2026*', 10);
        await prisma.user.create({
            data: {
                email: emailRoot,
                fullName: 'Super Rutify',
                password: hashedPassword,
                role: 'SUPER_ADMIN',
            },
        });
        console.log(`[Seed]: Super Administrador (${emailRoot}) creado exitosamente.`);
    } else {
        console.log(`[Seed]: El Super Administrador ya existe.`);
    }
}

main()
    .catch((e) => {
        console.error('[Seed Error]:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
        await pool.end();
    });