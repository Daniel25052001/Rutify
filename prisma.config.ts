import 'dotenv/config';
import { defineConfig } from '@prisma/config';

export default defineConfig({
  schema: 'prisma/schema.prisma',
  datasource: {
    url: 'postgresql://dev_user:dev_password@127.0.0.1:5432/transport_ticketing_db?schema=public',
  },
});