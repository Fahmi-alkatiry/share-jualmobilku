import { defineConfig } from '@prisma/config';
import * as dotenv from 'dotenv';

// Muat file .env secara eksplisit
dotenv.config();

export default defineConfig({
  datasource: {
    url: process.env.DATABASE_URL,
  },
});