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

    // 2. Crear o actualizar el Super Admin usando minúsculas obligatorias
    const emailRoot = 'superrutify@gmail.com'; //CORREO
    const plainPassword = 'RutifyMasterSecure2026*'; //CONTRASEÑA
    const hashedPassword = await bcrypt.hash(plainPassword, 10);

    // Upsert asegura que si ya existe (sin importar mayúsculas previas), se actualice con la contraseña y correo correctos
    const admin = await prisma.user.upsert({
        where: { email: emailRoot },
        update: {
            password: hashedPassword,
            fullName: 'Super Rutify',
            role: 'SUPER_ADMIN',
        },
        create: {
            email: emailRoot,
            fullName: 'Super Rutify',
            password: hashedPassword,
            role: 'SUPER_ADMIN',
        },
    });

    console.log(`[Seed]: Super Administrador (${admin.email}) sincronizado exitosamente.`);
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