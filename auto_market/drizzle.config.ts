import type { Config } from 'drizzle-kit';

export default {
  schema: './db/schema.ts',
  out: './db/migrations',
  dialect: 'sqlite',
  dbCredentials: {
    url: process.env.DRIZZLE_DB_URL || 'file:./.wrangler/state/v3/d1/miniflare-D1DatabaseObject/db.sqlite'
  }
} satisfies Config;
