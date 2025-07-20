# Virtual Hospital Backend

## Overview
The Virtual Hospital Backend is a Node.js application that provides authentication functionalities for users. It supports manual login using MongoDB as well as OAuth login via Google and GitHub accounts.

## Features
- User registration and manual login
- Google authentication
- GitHub authentication
- Middleware for authentication checks

## Technologies Used
- Node.js
- Express
- MongoDB
- TypeScript
- OAuth 2.0

## Project Structure
```
virtual-hospital-backend
├── src
│   ├── app.ts
│   ├── controllers
│   │   ├── authController.ts
│   │   ├── googleAuthController.ts
│   │   └── githubAuthController.ts
│   ├── middleware
│   │   └── authMiddleware.ts
│   ├── models
│   │   └── User.ts
│   ├── routes
│   │   ├── authRoutes.ts
│   │   └── googleAuthRoutes.ts
│   │   └── githubAuthRoutes.ts
│   └── types
│       └── index.ts
├── package.json
├── tsconfig.json
└── README.md
```

## Setup Instructions
1. Clone the repository:
   ```
   git clone <repository-url>
   ```
2. Navigate to the project directory:
   ```
   cd virtual-hospital-backend
   ```
3. Install the dependencies:
   ```
   npm install
   ```
4. Set up your MongoDB database and update the connection string in `src/app.ts`.
5. Configure Google and GitHub OAuth credentials and update the respective controllers.
6. Start the application:
   ```
   npm start
   ```

## Usage
- To register a new user, send a POST request to `/api/auth/register` with the required user details.
- To log in manually, send a POST request to `/api/auth/login` with the user's credentials.
- For Google login, redirect users to `/api/auth/google` and handle the callback at `/api/auth/google/callback`.
- For GitHub login, redirect users to `/api/auth/github` and handle the callback at `/api/auth/github/callback`.

## License
This project is licensed under the MIT License.