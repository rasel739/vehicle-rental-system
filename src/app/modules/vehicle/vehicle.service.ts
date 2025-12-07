import { pool } from '../../../config/db';
import { IVehicle } from '../../../types/db';

const createVehicle = async (payload: IVehicle) => {
  const { vehicle_name, type, registration_number, daily_rent_price, availability_status } =
    payload;

  if (!vehicle_name || !registration_number || !daily_rent_price) {
    throw new Error('Missing required fields');
  }

  const vehicleType = type || 'car';
  const status = availability_status || 'available';

  const query = `
    INSERT INTO vehicles(
      vehicle_name,
      type,
      registration_number,
      daily_rent_price,
      availability_status
    )
    VALUES ($1, $2, $3, $4, $5)
    RETURNING id, vehicle_name, type, registration_number, daily_rent_price, availability_status
  `;

  const result = await pool.query(query, [
    vehicle_name,
    vehicleType,
    registration_number,
    daily_rent_price,
    status,
  ]);

  return result.rows[0];
};

const getVehicles = async () => {
  const result = await pool.query(
    `SELECT id, vehicle_name, type, registration_number, daily_rent_price, availability_status FROM vehicles`
  );

  return result;
};

const getVehicleById = async (vehicleId: string) => {
  const id = Number(vehicleId);
  const result = await pool.query(
    `SELECT id, vehicle_name, type, registration_number, daily_rent_price, availability_status FROM vehicles WHERE id=$1`,
    [id]
  );

  if (result.rows.length === 0) {
    throw new Error('Vehicle not found!');
  }

  return result;
};

const updateVehicle = async (payload: IVehicle, vehicleId: string) => {
  const { vehicle_name, type, registration_number, daily_rent_price, availability_status } =
    payload;
  const id = Number(vehicleId);
  const result = await pool.query(
    `UPDATE vehicles SET vehicle_name=$1, type=$2, registration_number=$3, daily_rent_price=$4, availability_status=$5 WHERE id=$6 RETURNING id, vehicle_name, type, registration_number, daily_rent_price, availability_status`,
    [vehicle_name, type, registration_number, daily_rent_price, availability_status, id]
  );

  if (result.rows.length === 0) {
    throw new Error('Vehicle not found!');
  }

  return result;
};

const deleteVehicle = async (vehicleId: string) => {
  const id = Number(vehicleId);

  const result = await pool.query(`DELETE FROM vehicles WHERE id = $1`, [id]);

  return result;
};

export const VehicleService = {
  createVehicle,
  getVehicles,
  getVehicleById,
  updateVehicle,
  deleteVehicle,
};
