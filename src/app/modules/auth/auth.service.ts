import { QueryArrayResult, QueryResult, QueryResultRow } from 'pg';
import config from '../../../config';
import { pool } from '../../../config/db';
import { ILogin, IUser } from '../../../types/db';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const createUser = async (payload: IUser) => {
  const { name, email, password, role, phone } = payload;

  const hashPassword = await bcrypt.hash(password as string, Number(config.bycrypt_salt_round));

  let roles = role || 'customar';

  const result = pool.query(
    `
    INSERT INTO users(name,email,password,role,phone) VALUES($1,$2,$3,$4,$5) RETURNING id, name, email, phone, role
    `,
    [name, email, hashPassword, roles, phone]
  );

  return result;
};

const loginUser = async (payload: ILogin) => {
  const { email, password } = payload;

  const existsUser = await pool.query(
    `SELECT id,name,email,phone,role,password FROM users WHERE email=$1`,
    [email]
  );

  if (existsUser.rows.length === 0) {
    return null;
  }

  const user = existsUser.rows[0];

  const comparePassword = bcrypt.compare(password as string, user?.password);

  if (!comparePassword) {
    return false;
  }

  const token = jwt.sign({ userId: user.id, role: user.role }, config.jwt.secret as string, {
    expiresIn: '7d',
  });

  const userData = {
    id: user.id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    role: user.role,
  };

  return { token: `Bearer ${token}`, user: userData };
};

export const AuthService = {
  createUser,
  loginUser,
};
