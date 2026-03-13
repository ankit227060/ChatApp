# Project Documentation

## Overview
This project is a chat application with both client and server components. It is designed to provide real-time communication features, user authentication, and a modern user interface. The project is structured into two main directories:

- **Client**: Contains the frontend code built with modern web technologies.
- **Server**: Contains the backend code for handling API requests, authentication, and data storage.

---

## Client

### Key Files and Directories
- **index.html**: The entry point for the web application.
- **src/**: Contains the main source code for the frontend.
  - **App.tsx**: The root component of the application.
  - **main.tsx**: The entry point for the React application.
  - **socket.ts**: Handles WebSocket connections.
  - **components/**: Contains reusable UI components such as `ChatList`, `Message`, and `NavBar`.
  - **providers/**: Context providers for managing global state, e.g., `AuthProvider` and `ChatProvider`.
  - **routes/**: Defines the application's routes, including `Home`, `Login`, `Chat`, and `Profile`.
  - **utils.ts**: Utility functions used across the application.
- **tailwind.config.js**: Configuration for Tailwind CSS.
- **vite.config.ts**: Configuration for the Vite build tool.

### Technologies Used
- **React**: For building the user interface.
- **TypeScript**: For type-safe JavaScript development.
- **Tailwind CSS**: For styling the application.
- **Vite**: For fast development and build processes.

---

## Server

### Key Files and Directories
- **app.js**: The main entry point for the server application.
- **api/**: Contains API endpoints for handling requests.
  - **controllers/**: Business logic for handling chats, messages, and users.
  - **routes/**: Defines the API routes for chats, messages, and users.
- **models/**: Defines the database models for entities like `User`, `Chat`, and `Message`.
- **services/**: Contains service logic for interacting with the database and other layers.
- **strategies/**: Authentication strategies, including GitHub, Google, and JWT.
- **utils.js**: Utility functions for the server.

### Technologies Used
- **Node.js**: For building the backend server.
- **Express.js**: For handling HTTP requests and routing.
- **MongoDB**: For database storage.
- **Passport.js**: For authentication strategies.

---

## Deployment

### Client Deployment
- **Vercel**: The client is configured for deployment on Vercel.
- **vercel.json**: Contains Vercel-specific configuration.

### Server Deployment
- **Heroku**: The server is configured for deployment on Heroku.
- **Procfile**: Specifies the commands to run the server on Heroku.

---

## How to Run the Project

### Prerequisites
- Node.js and npm installed.
- MongoDB database running.

### Steps
1. Clone the repository.
2. Navigate to the `client` directory and run `npm install` to install dependencies.
3. Start the client with `npm run dev`.
4. Navigate to the `server` directory and run `npm install` to install dependencies.
5. Start the server with `node app.js`.

---

## Contribution Guidelines
1. Fork the repository.
2. Create a new branch for your feature or bug fix.
3. Commit your changes with clear and concise messages.
4. Submit a pull request for review.

---

## License
This project is licensed under the MIT License.