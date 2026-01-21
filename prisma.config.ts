import { defineConfig } from '@prisma/config';

export default defineConfig({
  datasource: {
    // Gunakan URL langsung dari env secara eksplisit
    url: process.env.DATABASE_URL,
  },
});
