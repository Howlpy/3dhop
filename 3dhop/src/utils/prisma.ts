import { PrismaClient } from '@prisma/client';
import { readReplicas } from '@prisma/extension-read-replicas';

// Declarar el tipo global
declare global {
  var prisma: ReturnType<typeof createPrismaClient> | undefined;
}

// Función para crear el cliente de Prisma con las extensiones
function createPrismaClient() {
  if (!process.env.DATABASE_READ_REPLICA_URL) {
    console.warn("DATABASE_READ_REPLICA_URL no está definido, usando solo la base de datos principal");
    process.env.DATABASE_READ_REPLICA_URL = process.env.DATABASE_URL;
  }

  return new PrismaClient()
    .$extends(readReplicas({
      url: process.env.DATABASE_READ_REPLICA_URL!
    }));
}

// Usar una única instancia global siempre
const prisma = global.prisma || createPrismaClient();
global.prisma = prisma;

export default prisma;  