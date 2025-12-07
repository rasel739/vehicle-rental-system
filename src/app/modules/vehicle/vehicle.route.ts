import { Router } from 'express';
import auth from '../../middlewares/auth';
import { ENUM_USER_ROLE } from '../../../constant';
import { VehicleController } from './vehicle.controller';

const router = Router();

router.post('/', auth(ENUM_USER_ROLE.ADMIN), VehicleController.createVehicle);

router.get('/', VehicleController.getVehicles);

router.get('/:vehicleId', VehicleController.getVehicleById);

router.put('/:vehicleId', auth(ENUM_USER_ROLE.ADMIN), VehicleController.updateVehicle);
router.delete('/:vehicleId', auth(ENUM_USER_ROLE.ADMIN), VehicleController.deleteVehicle);

export const VehicleRoutes = router;
