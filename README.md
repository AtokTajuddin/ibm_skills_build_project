# Virtual Hospital Project
Enchaned with Copilot & IBM Granite

A full-stack web application for a Virtual Hospital with AI-powered virtual doctor consultations and referrals to real healthcare professionals.

## Project Structure

The project is divided into two main parts:

1. **Backend**: Node.js/Express/MongoDB API with authentication
2. **Frontend**: React-based user interface

## Features

- User authentication (email/password)
- Social login with Google and GitHub using client-side libraries
- Virtual doctor consultations using Nous Research DeepHermes-3-LLama-3-8B model
- Referrals to real healthcare professionals
- Modern, responsive UI

## Tech Stack

### Backend
- Node.js with Express
- TypeScript
- MongoDB with Mongoose
- JWT Authentication
- OAuth 2.0 for Google and GitHub authentication

### Frontend
- React.js
- React Router
- Bootstrap
- Axios for API requests

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (running locally or a remote instance)
- Google OAuth credentials (for Google login)
- GitHub OAuth App credentials (for GitHub login)

## Getting Started

### Backend Setup

1. Navigate to the backend directory
2. Install dependencies
   ```bash
   npm install
   ```
3. Create a `.env` file with your configuration
   ```
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/virtual_hospital
   JWT_SECRET=your_jwt_secret_key_here
   GOOGLE_CLIENT_ID=your_google_client_id_here
   GOOGLE_CLIENT_SECRET=your_google_client_secret_here
   FRONTEND_URL=http://localhost:3000
   ```
4. Start the development server
   ```bash
   npm run dev
   ```

### Frontend Setup

1. Navigate to the frontend directory
2. Install dependencies
   ```bash
   npm install
   ```
3. Start the development server
   ```bash
   npm start
   ```

## LLM Integration

To integrate the Nous Research DeepHermes-3-LLama-3-8B model:

1. The project is already configured to use the free model "nousresearch/deephermes-3-llama-3-8b-preview"
2. Your API key is stored in the `.env` file under the `LLM_API_KEY` variable
3. The backend makes API calls to the Nous Research API endpoint
4. The VirtualDoctor component in the frontend communicates with this backend endpoint

No additional setup is required for the LLM integration as it's already configured to use the free API pricing tier.

## License

MIT
