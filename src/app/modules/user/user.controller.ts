import { UserService } from './user.service';
import { Request, Response } from 'express';

const getUsers = async (req: Request, res: Response) => {
  try {
    const result = await UserService.getUsers();

    res.status(200).json({
      success: true,
      message: 'Users retrieved successfully',
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

const updateUser = async (req: Request, res: Response) => {
  const { userId, role } = req.user as { userId: string; role: string };

  try {
    const result = await UserService.updateUser(
      req.body,
      { id: userId, role },
      req.params.userId as string
    );

    res.status(200).json({
      success: true,
      message: 'User updated successfully',
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

const deleteUser = async (req: Request, res: Response) => {
  try {
    await UserService.deleteUser(req.params.userId as string);

    res.status(201).json({
      success: true,
      message: 'User deleted successfully',
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Invalid request';
    res.status(400).json({
      success: false,
      message: errorMessage,
    });
  }
};

export const UserController = {
  getUsers,
  updateUser,
  deleteUser,
};
