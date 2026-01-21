import { PrismaClient } from '@prisma/client'

const globalForPrisma = global as unknown as { prisma: PrismaClient }

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient() // Polos saja, Prisma akan otomatis baca dari .env

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma