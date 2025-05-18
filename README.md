# WeCare Application

WeCare is a comprehensive healthcare management system designed to streamline patient care, staff scheduling, and visit tracking for healthcare organizations. The application helps medical providers manage shifts, track patient visits, and maintain patient records in a secure and efficient manner.

## Features

- **Shift Management**: Schedule and manage staff shifts
- **Visit Tracking**: Record and monitor patient visits
- **User Authentication**: Secure login and role-based access control
- **Patient Records**: Maintain comprehensive patient information
- **Responsive UI**: Modern and intuitive user interface

## Architecture

WeCare uses a microservices architecture:

- **Frontend**: Next.js application with Tailwind CSS and shadcn/ui components
- **API Gateway**: NestJS service that routes requests to appropriate microservices
- **Shift Service**: Microservice for managing staff shifts
- **Visit Service**: Microservice for tracking patient visits
- **Database**: PostgreSQL database with Prisma ORM

## Prerequisites

- Node.js (v18 or later)
- npm (v9 or later)
- PostgreSQL (v15 or later)
- Git

## Installation and Setup (No Docker)

### 1. Clone the Repository

```bash
git clone <repository-url>
cd wecare
```

### 2. Database Setup

Ensure PostgreSQL is installed and running on your system.

Create a new database for the application:

```bash
psql -U postgres
```

In the PostgreSQL shell:

```sql
CREATE DATABASE wecare;
\q
```

### 3. Backend Setup

#### a. Install Dependencies

```bash
cd apps/backend
npm install
```

#### b. Configure Environment Variables

Create a `.env` file in the `apps/backend` directory with the following content:

```
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/wecare"
JWT_SECRET="your_jwt_secret_key"
```

Adjust the database connection details as needed.

#### c. Run Database Migrations

```bash
npx prisma migrate dev --name init
```

#### d. Seed the Database (Optional)

```bash
npm run db:seed
```

#### e. Start the Microservices

Start the API Gateway:

```bash
npm run start:dev
```

In separate terminal windows:

Start the Shift Service:

```bash
npm run start:shift:dev
```

Start the Visit Service:

```bash
npm run start:visit:dev
```

### 4. Frontend Setup

#### a. Install Dependencies

```bash
cd ../../apps/frontend
npm install
```

#### b. Configure Environment Variables

Create a `.env.local` file in the `apps/frontend` directory:

```
NEXT_PUBLIC_API_URL=http://localhost:4200
```

#### c. Start the Frontend Development Server

```bash
npm run dev
```

### 5. Access the Application

- Frontend: http://localhost:3000
- API Gateway: http://localhost:4200
- API Documentation: http://localhost:4200/api

## Development Workflow

### Running Tests

Backend tests:

```bash
cd apps/backend
npm run test
```

End-to-end tests:

```bash
cd apps/backend
npm run test:e2e
```

### Code Formatting and Linting

Backend:

```bash
cd apps/backend
npm run format
npm run lint
```

Frontend:

```bash
cd apps/frontend
npm run lint
```

## Project Structure

### Backend

```
apps/backend/
├── apps/
│   ├── api-gateway/    # Main API Gateway service
│   ├── shift/          # Shift management microservice
│   └── visit/          # Visit tracking microservice
├── libs/               # Shared libraries
├── prisma/             # Database schema and migrations
└── package.json        # Backend dependencies and scripts
```

### Frontend

```
apps/frontend/
├── app/                # Next.js app directory
├── components/         # React components
│   └── ui/             # UI component library
├── hooks/              # Custom React hooks
├── lib/                # Utility functions and types
└── package.json        # Frontend dependencies and scripts
```

## API Documentation

Once the application is running, you can access the Swagger API documentation at:

```
http://localhost:4200/api
```

## Troubleshooting

### Database Connection Issues

- Ensure PostgreSQL is running
- Verify the `DATABASE_URL` in your `.env` file matches your PostgreSQL configuration
- Check that the database user has appropriate permissions

### Microservice Communication Problems

- Make sure all microservices are running
- Verify the host and port configurations in the gateway modules

### Frontend API Connection

- Ensure the API Gateway is running
- Check that `NEXT_PUBLIC_API_URL` is set correctly in your frontend environment

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests to ensure they pass
5. Submit a pull request

## License

[Include your license information here]
