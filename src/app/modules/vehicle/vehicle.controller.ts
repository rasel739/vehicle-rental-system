import { Request, Response } from 'express';
import { VehicleService } from './vehicle.service';

const createVehicle = async (req: Request, res: Response) => {
  try {
    const vehicle = await VehicleService.createVehicle(req.body);

    res.status(201).json({
      success: true,
      message: 'Vehicle created successfully',
      data: vehicle,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Invalid request';
    res.status(400).json({
      success: false,
      message: errorMessage,
    });
  }
};

const getVehicles = async (req: Request, res: Response) => {
  try {
    const result = await VehicleService.getVehicles();

    res.status(200).json({
      success: true,
      message: 'Vehicles retrieved successfully',
      data: result.rows,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Invalid request';
    res.status(400).json({
      success: false,
      message: errorMessage,
    });
  }
};

const getVehicleById = async (req: Request, res: Response) => {
  try {
    const result = await VehicleService.getVehicleById(req.params.vehicleId as string);

    res.status(200).json({
      success: true,
      message: 'Vehicles retrieved successfully',
      data: result.rows[0],
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Invalid request';
    res.status(400).json({
      success: false,
      message: errorMessage,
    });
  }
};

const updateVehicle = async (req: Request, res: Response) => {
  try {
    const result = await VehicleService.updateVehicle(req.body, req.params.vehicleId as string);

    res.status(200).json({
      success: true,
      message: 'Vehicle updated successfully',
      data: result.rows[0],
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Invalid request';
    res.status(400).json({
      success: false,
      message: errorMessage,
    });
  }
};

const deleteVehicle = async (req: Request, res: Response) => {
  try {
    await VehicleService.deleteVehicle(req.params.vehicleId as string);

    res.status(201).json({
      success: true,
      message: 'VVehicle deleted successfully',
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Invalid request';
    res.status(400).json({
      success: false,
      message: errorMessage,
    });
  }
};

export const VehicleController = {
  createVehicle,
  getVehicles,
  getVehicleById,
  updateVehicle,
  deleteVehicle,
};
