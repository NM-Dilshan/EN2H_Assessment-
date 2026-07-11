# Booking Platform REST API

NestJS 11 technical assignment for a booking platform with authentication, service management, booking workflows, Prisma ORM, PostgreSQL, and Swagger documentation.

## Overview

This API lets authenticated users manage services and lets customers create bookings without authentication. It uses JWT authentication, Prisma migrations, DTO validation, and centralized error handling.

## Features

- JWT register and login flow.
- Current user endpoint.
- Service create, read, update, and delete operations.
- Booking create, list, retrieve, status update, and cancel operations.
- Booking rules for service existence, duplicate prevention, and date validation.
- Swagger documentation at `/api`.
- Prisma PostgreSQL integration.

## Tech Stack

- NestJS 11
- TypeScript
- PostgreSQL
- Prisma ORM
- JWT / Passport
- class-validator and class-transformer
- bcrypt

## Installation

```bash
npm install
```

## Environment Setup

Copy `.env.example` to `.env` and set the values for your database and JWT secret.

```bash
DATABASE_URL=postgresql://USER:PASSWORD@HOST:5432/DATABASE?schema=public
JWT_SECRET=change-this-secret
PORT=3000
```

## Database Setup

```bash
npx prisma generate
npx prisma migrate dev
```

If the schema changes, rerun both commands.

## Running the Application

```bash
npm run start:dev
```

Production build:

```bash
npm run build
npm run start:prod
```

## API Documentation

Swagger UI:

```bash
http://localhost:3000/api
```

Postman collection:

```bash
postman/Booking Platform REST API.postman_collection.json
```

## Endpoints

### Auth

- `POST /auth/register`
- `POST /auth/login`
- `GET /auth/me`

### Services

- `POST /services`
- `GET /services`
- `GET /services/:id`
- `PATCH /services/:id`
- `DELETE /services/:id`

### Bookings

- `POST /bookings`
- `GET /bookings`
- `GET /bookings/:id`
- `PATCH /bookings/:id/status`
- `PATCH /bookings/:id/cancel`

## Assumptions

- Booking dates use `YYYY-MM-DD` and booking times use `HH:mm`.
- Dates are validated using server local time.
- Service management requires a valid JWT.
- Booking creation is public.

## Future Improvements

- Add pagination and filtering.
- Add refresh tokens.
- Add more integration coverage.
- Add ownership restrictions for service edits if needed.

## Testing

```bash
npm run test
npm run test:e2e
```

## Submission Notes

- Database migration files are included in `prisma/migrations`.
- Swagger and Postman cover the required API flows.
