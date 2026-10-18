# COMP 3123 – Assignment 1

**Student Name:** Hanad Hassan  
**Student ID:** 101337849  

## Project Overview

This project is a REST API for managing employee records. It is built using Node.js, Express, and MongoDB.

Users can register, log in, and manage their employees. Each employee is linked to the user who created it, so users cannot access other users' records.

## Technologies Used

- Node.js and Express.js
- MongoDB Atlas and Mongoose
- JavaScript
- JWT and bcryptjs
- Zod for validation
- Helmet and Express Rate Limit
- Winston for logging
- Postman for API testing

## Installation

1. Clone or download the repository.
2. Install dependencies:

   `npm install`

3. Create a `.env` file with the following configuration:

   ```
   PORT=5000
   NODE_ENV=development
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_secret_key
   JWT_EXPIRES_IN=1h
   LOG_LEVEL=info
   ```

4. Start the server:

   `npm run dev`

5. Test the API at `http://localhost:5000`.

The MongoDB database name is `comp3123_assignment1`.

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| POST | /api/v1/user/signup | Register a user |
| POST | /api/v1/user/login | Login and generate JWT |
| GET | /api/v1/emp/employees | Get user's employees |
| POST | /api/v1/emp/employees | Add employee |
| GET | /api/v1/emp/employees/:eid | Get employee by ID |
| PUT | /api/v1/emp/employees/:eid | Update employee |
| DELETE | /api/v1/emp/employees?eid=ID | Delete employee |
| GET | /health | Check server status |

## Authentication and Security

Passwords are hashed using bcrypt before being stored in MongoDB.

After login, users receive a JWT token. Employee endpoints require the token in the Authorization header:

`Authorization: Bearer YOUR_TOKEN`

Employee database queries check the authenticated user's ID to prevent access to other users' records.

Zod is used for input validation, Helmet adds security headers, and rate limiting helps prevent excessive requests. Authentication endpoints allow 10 requests per 15 minutes, while general API traffic is limited to 100 requests per 15 minutes.

The API returns appropriate HTTP status codes for successful operations, invalid requests, authentication errors, duplicate records, and server errors.

## Logging and Health Check

Winston saves application logs in the `logs` directory, including request information, response status codes, and errors. Passwords and authentication tokens are not logged.

The `/health` endpoint returns the server status and MongoDB connection status.

## Testing

API requests are tested using Postman, including signup, login, employee CRUD, validation, and authorization.

The exported Postman collection is available in the `postman` folder.

Screenshots of the test results and MongoDB collections are included in the `docs` folder.

## Conclusion

This assignment demonstrates REST API development with user authentication, MongoDB relationships, employee management, validation, authorization, and basic API security.
