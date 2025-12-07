import { Router } from 'express';
import auth from '../../middlewares/auth';
import { ENUM_USER_ROLE } from '../../../constant';
import { UserController } from './user.controller';

const router = Router();

router.get('/', auth(ENUM_USER_ROLE.ADMIN), UserController.getUsers);

router.put(
  '/:userId',
  auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.CUSTOMAR),
  UserController.updateUser
);
router.delete('/:userId', auth(ENUM_USER_ROLE.ADMIN), UserController.deleteUser);

export const UserRoutes = router;
