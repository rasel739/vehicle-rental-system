# Vehicle Rental System

A robust RESTful API for managing vehicle rentals built with Node.js, Express, TypeScript, and PostgreSQL.

## Features

- **User Authentication & Authorization**: Secure JWT-based authentication with role-based access control (Admin & Customer)
- **Vehicle Management**: Complete CRUD operations for vehicle inventory
- **User Management**: Admin capabilities to manage users and their roles
- **Booking System**: Full booking management with automatic price calculation and status tracking
- **Database Integration**: PostgreSQL with automated schema creation
- **Type Safety**: Full TypeScript implementation for enhanced development experience
- **Security**: Password hashing with bcrypt and Bearer token authentication

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js v5
- **Language**: TypeScript
- **Database**: PostgreSQL
- **Authentication**: JSON Web Tokens (JWT)
- **Password Hashing**: bcrypt
- **Development**: tsx for hot-reload development

## Prerequisites

- Node.js (v20 or higher)
- PostgreSQL database
- npm or yarn package manager

## Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd vehicle-rental-system
```

2. Install dependencies:

```bash
npm install
# or
yarn install
```

3. Create a `.env` file in the root directory based on `env.example`:

```env
NODE_ENV=development
PORT=5000
DATABASE_URL=postgresql://username:password@localhost:5432/vehicle_rental
BYCRYPT_SALT_ROUND=10
JWT_SECRET=your_secret_key_here
JWT_EXPIRES_IN=7d
```

4. The database schema will be automatically created on first run.

## Running the Application

### Development Mode

```bash
npm run dev
# or
yarn dev
```

### Production Mode

```bash
# Build the project
npm run build
# or
yarn build

# Start the server
npm start
# or
yarn start
```

The server will start on `http://localhost:5000` (or your configured PORT).

## API Endpoints

### Authentication

#### Register a New User

```http
POST /api/v1/auth/signup
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securePassword123",
  "phone": "+1234567890",
  "role": "customar"
}
```

#### Login

```http
POST /api/v1/auth/signin
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "securePassword123"
}
```

**Response:**

```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "jwt_token_here",
    "user": {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com",
      "phone": "+1234567890",
      "role": "customar"
    }
  }
}
```

### Vehicles

#### Get All Vehicles (Public)

```http
GET /api/v1/vehicles
```

#### Get Vehicle by ID (Public)

```http
GET /api/v1/vehicles/:vehicleId
```

#### Create Vehicle (Admin Only)

```http
POST /api/v1/vehicles
Authorization: <jwt_token>
Content-Type: application/json

{
  "vehicle_name": "Toyota Camry",
  "type": "car",
  "registration_number": "ABC-1234",
  "daily_rent_price": 50.00,
  "availability_status": "available"
}
```

#### Update Vehicle (Admin Only)

```http
PUT /api/v1/vehicles/:vehicleId
Authorization: <jwt_token>
Content-Type: application/json

{
  "vehicle_name": "Toyota Camry 2024",
  "type": "car",
  "registration_number": "ABC-1234",
  "daily_rent_price": 55.00,
  "availability_status": "available"
}
```

#### Delete Vehicle (Admin Only)

```http
DELETE /api/v1/vehicles/:vehicleId
Authorization: <jwt_token>
```

### Users

#### Get All Users (Admin Only)

```http
GET /api/v1/users
Authorization: <jwt_token>
```

#### Update User (Admin or Own Profile)

```http
PUT /api/v1/users/:userId
Authorization: <jwt_token>
Content-Type: application/json

{
  "name": "John Doe Updated",
  "email": "john.updated@example.com",
  "phone": "+1234567890",
  "role": "admin"
}
```

#### Delete User (Admin Only)

```http
DELETE /api/v1/users/:userId
Authorization: <jwt_token>
```

## Database Schema

### Users Table

```sql
id SERIAL PRIMARY KEY
name VARCHAR(100) NOT NULL
email VARCHAR(255) UNIQUE NOT NULL
password TEXT NOT NULL
phone TEXT NOT NULL
role VARCHAR(50) NOT NULL
created_at TIMESTAMP DEFAULT NOW()
updated_at TIMESTAMP DEFAULT NOW()
```

### Vehicles Table

```sql
id SERIAL PRIMARY KEY
vehicle_name VARCHAR(200) NOT NULL
type VARCHAR(50) NOT NULL
registration_number VARCHAR(50) UNIQUE NOT NULL
daily_rent_price NUMERIC(10,2) NOT NULL
availability_status VARCHAR(50) NOT NULL
created_at TIMESTAMP DEFAULT NOW()
updated_at TIMESTAMP DEFAULT NOW()
```

### Bookings Table

```sql
id SERIAL PRIMARY KEY
customer_id INT REFERENCES users(id) ON DELETE CASCADE
vehicle_id INT REFERENCES vehicles(id)
rent_start_date DATE NOT NULL
rent_end_date DATE NOT NULL
total_price NUMERIC(10,2) NOT NULL
status VARCHAR(50) NOT NULL
created_at TIMESTAMP DEFAULT NOW()
updated_at TIMESTAMP DEFAULT NOW()
```

## User Roles

- **admin**: Full access to all endpoints, can manage vehicles, users, and all bookings. Can mark bookings as returned.
- **customer**: Can view vehicles, create bookings, view own bookings, update own profile, and cancel own bookings.

## Error Handling

The API returns standardized error responses:

```json
{
  "success": false,
  "message": "Error message here"
}
```

Common HTTP status codes:

- `200`: Success
- `201`: Created
- `400`: Bad Request
- `401`: Unauthorized
- `403`: Forbidden
- `404`: Not Found
- `500`: Internal Server Error

## Project Structure

```
vehicle-rental-system/
├── src/
│   ├── app/
│   │   ├── middlewares/
│   │   │   └── auth.ts
│   │   └── modules/
│   │       ├── auth/
│   │       │   ├── auth.controller.ts
│   │       │   ├── auth.route.ts
│   │       │   └── auth.service.ts
│   │       ├── booking/
│   │       │   ├── booking.controller.ts
│   │       │   ├── booking.route.ts
│   │       │   └── booking.service.ts
│   │       ├── user/
│   │       │   ├── user.controller.ts
│   │       │   ├── user.route.ts
│   │       │   └── user.service.ts
│   │       └── vehicle/
│   │           ├── vehicle.controller.ts
│   │           ├── vehicle.route.ts
│   │           └── vehicle.service.ts
│   ├── config/
│   │   ├── index.ts
│   │   └── db.ts
│   ├── constant/
│   │   └── index.ts
│   ├── types/
│   │   ├── db.ts
│   │   ├── common.ts
│   │   └── index.d.ts
│   ├── app.ts
│   └── server.ts
├── .env
├── .gitignore
├── package.json
├── tsconfig.json
└── README.md
```

## Security Features

- Password hashing with bcrypt (configurable salt rounds)
- JWT Bearer token-based authentication
- Role-based access control (RBAC)
- Protected routes with middleware
- Secure token validation
- Environment variable configuration
- SQL injection prevention with parameterized queries

## License

This project is licensed under the ISC License.

## Author

Rasel Hossain

## Support

For support, email raselhossain6059@gmail.com or open an issue in the repository.
