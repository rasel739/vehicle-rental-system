import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const config = {
  env: process.env.NODE_ENV || 'development',
  port: process.env.PORT || 5000,
  database_url: process.env.DATABASE_URL,
  bycrypt_salt_round: process.env.BYCRYPT_SALT_ROUND || 10,
  jwt: {
    secret: process.env.JWT_SECRET || 'demo739',
    expires_in: process.env.JWT_EXPIRES_IN || '7d',
  },
};

export default config;
