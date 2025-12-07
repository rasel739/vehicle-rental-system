import { Request, Response } from 'express';
import { AuthService } from './auth.service';

const createUser = async (req: Request, res: Response) => {
  try {
    const result = await AuthService.createUser(req.body);

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: result.rows[0],
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'invalid request';
    res.status(500).json({
      success: false,
      message: errorMessage,
    });
  }
};

const loginUser = async (req: Request, res: Response) => {
  try {
    const result = await AuthService.loginUser(req.body);

    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: result,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'invalid request';
    res.status(500).json({
      success: false,
      message: errorMessage,
    });
  }
};

export const AuthController = {
  createUser,
  loginUser,
};
