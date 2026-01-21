import { PrismaClient } from '@prisma/client'

const globalForPrisma = global as unknown as { prisma: PrismaClient }

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    // Pada Prisma 7, jika schema.prisma tidak punya baris 'url', 
    // kita harus memasukkannya di sini.
    datasourceUrl: process.env.DATABASE_URL, 
  })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma