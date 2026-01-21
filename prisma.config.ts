import { defineConfig } from '@prisma/config';

export default defineConfig({
  datasource: {
    // Prisma 7 akan membaca URL dari sini untuk perintah 'db push' dan 'migrate'
    url: process.env.DATABASE_URL,
  },
});