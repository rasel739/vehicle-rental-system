import { pool } from '../../../config/db';
import { ENUM_USER_ROLE } from '../../../constant';
import { IUser } from '../../../types/db';

const getUsers = async () => {
  const result = await pool.query(`SELECT id, name, email, phone,role FROM users`);

  if (result.rows.length === 0) {
    throw new Error('User not found');
  }

  return result;
};

const updateUser = async (payload: IUser, user: { id: string; role: string }, userId: string) => {
  const { name, email, phone, role } = payload;

  let result;

  if (user.role === ENUM_USER_ROLE.ADMIN) {
    result = await pool.query(
      `UPDATE users SET name=$1,email=$2,phone=$3,role=$4 WHERE id=$5 RETURNING id,name,email,phone,role`,
      [name, email, phone, role, userId]
    );
  } else {
    result = await pool.query(
      `UPDATE users SET name=$1,phone=$2 WHERE id=$3 RETURNING id,name,email,phone,role`,
      [name, phone, user.id]
    );
  }

  return result;
};

const deleteUser = async (id: string) => {
  const result = await pool.query(`DELETE FROM users WHERE id = $1`, [id]);

  return result;
};

export const UserService = {
  getUsers,
  updateUser,
  deleteUser,
};
