import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function generateAdminUser() {
    const salt = await bcrypt.genSalt();
    const hash: string = await bcrypt.hash(process.env.EMAILPASS, salt);

    await prisma.user.create({
        data: {
            email: process.env.EMAIL,
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