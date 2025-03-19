import { PrismaClient } from '@prisma/client';

// Declarar el tipo global
declare global {
  var prisma: PrismaClient | undefined;
}


// Usar una única instancia global siempre
const prisma = new PrismaClient()
global.prisma = prisma;

export default prisma;  