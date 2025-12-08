import { pool } from '../../../config/db';
import { ENUM_USER_ROLE } from '../../../constant';
import { IBookings } from '../../../types/db';

const createBookings = async (payload: IBookings) => {
  const { customer_id, vehicle_id, rent_start_date, rent_end_date, status } = payload;

  const book_status = status || 'active';

  const result = await pool.query(
    `
    INSERT INTO bookings (
      customer_id, vehicle_id, rent_start_date, rent_end_date, total_price, status
    )
    SELECT $1, $2, $3, $4, (v.daily_rent_price * ($4::date - $3::date)), $5
    FROM vehicles v
    WHERE v.id = $2
    RETURNING id, customer_id, vehicle_id, rent_start_date, rent_end_date, total_price, status
    `,
    [customer_id, vehicle_id, rent_start_date, rent_end_date, book_status]
  );

  const rows = Array.isArray(result) ? result : result.rows;

  if (!rows || rows.length === 0) {
    throw new Error('Vehicle not found-booking not created');
  }

  const vehicle = await pool.query(
    `SELECT  vehicle_name, daily_rent_price FROM vehicles WHERE id=$1`,
    [rows[0].customer_id]
  );

  return {
    ...rows[0],
    vehicle: {
      ...vehicle.rows[0],
    },
  };
};

const getBookings = async (userId: string, role: string) => {
  let bookingsResult;

  if (role === ENUM_USER_ROLE.ADMIN) {
    bookingsResult = await pool.query(`
      SELECT
        id, customer_id, vehicle_id, rent_start_date,
        rent_end_date, total_price, status
      FROM bookings
      ORDER BY rent_start_date DESC
    `);
  } else {
    bookingsResult = await pool.query(
      `
      SELECT
        id, customer_id, vehicle_id, rent_start_date,
        rent_end_date, total_price, status
      FROM bookings
      WHERE customer_id = $1
      ORDER BY rent_start_date DESC
      `,
      [userId]
    );
  }

  const bookings = bookingsResult.rows;

  if (bookings.length === 0) {
    return [];
  }

  const finalResult = [];

  for (let booking of bookings) {
    let customerInfo = null;

    if (role === ENUM_USER_ROLE.ADMIN) {
      const customerQuery = await pool.query(`SELECT name, email FROM users WHERE id = $1`, [
        booking.customer_id,
      ]);
      customerInfo = customerQuery.rows[0];
    }

    const vehicleQuery = await pool.query(
      `
      SELECT vehicle_name, registration_number, type
      FROM vehicles
      WHERE id=$1
      `,
      [booking.vehicle_id]
    );

    const vehicleInfo = vehicleQuery.rows[0];

    finalResult.push({
      ...booking,
      customer: customerInfo,
      vehicle: vehicleInfo,
    });
  }

  return finalResult;
};

const updateBookings = async (
  bookingId: string,
  role: string,
  userId: string,
  payload: { status: string }
) => {
  const { status } = payload;

  const bookingResult = await pool.query(`SELECT * FROM bookings WHERE id = $1`, [bookingId]);

  if (bookingResult.rows.length === 0) {
    return {
      success: false,
      message: 'Booking not found',
    };
  }

  const booking = bookingResult.rows[0];

  if (role === ENUM_USER_ROLE.CUSTOMER) {
    if (booking.customer_id !== userId) {
      return {
        success: false,
        message: 'You are not allowed to update this booking',
      };
    }

    if (status !== 'cancelled') {
      return {
        success: false,
        message: 'Customers can only cancel bookings',
      };
    }

    const cancelledResult = await pool.query(
      `UPDATE bookings
       SET status = $1
       WHERE id = $2
       RETURNING *`,
      ['cancelled', bookingId]
    );

    return {
      success: true,
      message: 'Booking cancelled successfully',
      data: cancelledResult.rows[0],
    };
  }

  if (role === ENUM_USER_ROLE.ADMIN) {
    if (status !== 'returned') {
      return {
        success: false,
        message: 'Admin can only mark booking as returned',
      };
    }

    const returnedBooking = await pool.query(
      `UPDATE bookings
       SET status = $1
       WHERE id = $2
       RETURNING *`,
      ['returned', bookingId]
    );

    const vehicleUpdate = await pool.query(
      `UPDATE vehicles
       SET availability_status = 'available'
       WHERE id = $1
       RETURNING availability_status`,
      [booking.vehicle_id]
    );

    return {
      success: true,
      message: 'Booking marked as returned. Vehicle is now available',
      data: {
        ...returnedBooking.rows[0],
        vehicle: { ...vehicleUpdate.rows[0] },
      },
    };
  }

  return {
    success: false,
    message: 'You are not authorized to update this booking',
  };
};

export const BookingsService = {
  createBookings,
  getBookings,
  updateBookings,
};
