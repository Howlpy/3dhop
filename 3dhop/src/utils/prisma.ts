import { PrismaClient } from '@prisma/client';
import { readReplicas } from '@prisma/extension-read-replicas';

// Validar que la variable de entorno existe
if (!process.env.DATABASE_READ_REPLICA_URL) {
  throw new Error("DATABASE_READ_REPLICA_URL no está definido");
}

const prisma = new PrismaClient()
  .$extends(readReplicas({
    url: process.env.DATABASE_READ_REPLICA_URL!
  }))

export default prisma;