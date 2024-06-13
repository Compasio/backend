import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function generateAdminUser() {
    const salt = await bcrypt.genSalt();
    const hash: string = await bcrypt.hash('admin123', salt);

    await prisma.user.create({
        data: {
            email: 'compassioAdm@compassio.com.br',
            password: hash,
            userType: 'admin'
        }
    })
}

generateAdminUser()
.catch(e => {
    console.error(e);
    process.exit(1);
})
.finally(async () => {
    await prisma.$disconnect();
});