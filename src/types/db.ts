export type userRole = 'admin' | 'customar';
export type vehicleType = 'car' | 'bike' | 'van' | 'SUV';

export interface IUser {
  name: string;
  email: string;
  password: string;
  role?: userRole;
  phone: string;
}

export interface ILogin {
  email: string;
  password: string;
}

export interface IVehicle {
  vehicle_name: string;
  type: vehicleType;
  registration_number: string;
  daily_rent_price: number;
  availability_status: 'available' | 'booked';
}
