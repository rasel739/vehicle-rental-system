import { Request, Response } from 'express';
import { BookingsService } from './booking.service';
import { ENUM_USER_ROLE } from '../../../constant';

const createBookings = async (req: Request, res: Response) => {
  try {
    const result = await BookingsService.createBookings(req.body);
    res.status(201).json({
      success: true,
      message: 'Booking created successfully',
      data: result,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Invalid request';
    res.status(400).json({
      success: false,
      message: errorMessage,
    });
  }
};

const getBookings = async (req: Request, res: Response) => {
  const { userId, role } = req.user as { userId: string; role: string };
  try {
    const result = await BookingsService.getBookings(userId, role);

    if (role === ENUM_USER_ROLE.ADMIN) {
      res.status(200).json({
        success: true,
        message: 'Bookings retrieved successfully',
        data: result,
      });
    } else {
      res.status(200).json({
        success: true,
        message: 'Your bookings retrieved successfully',
        data: result,
      });
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Invalid request';
    res.status(400).json({
      success: false,
      message: errorMessage,
    });
  }
};

const updateBookings = async (req: Request, res: Response) => {
  const { userId, role } = req.user as { userId: string; role: string };
  const bookingId = req.params.bookingId as string;
  try {
    const result = await BookingsService.updateBookings(bookingId, role, userId, req.body);
    res.status(200).json(result);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Invalid request';
    res.status(400).json({
      success: false,
      message: errorMessage,
    });
  }
};

export const BookingsController = {
  createBookings,
  getBookings,
  updateBookings,
};
