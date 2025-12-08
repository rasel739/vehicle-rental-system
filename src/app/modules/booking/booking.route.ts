import { Router } from 'express';
import { BookingsController } from './booking.controller';
import auth from '../../middlewares/auth';
import { ENUM_USER_ROLE } from '../../../constant';

const router = Router();

router.post(
  '/',
  auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.CUSTOMER),
  BookingsController.createBookings
);

router.get(
  '/',
  auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.CUSTOMER),
  BookingsController.getBookings
);

router.put('/:bookingId', auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.CUSTOMER));

export const BookingsRoutes = router;
