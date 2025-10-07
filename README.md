
# StoryHub

StoryHub is a full-stack MERN web application for sharing, discovering, and managing stories. Users can sign up, build profiles, and create, update, or delete their own stories. All stories are publicly readable, so visitors can browse without logging in. The platform features:

- User authentication and profile management
- Create, edit, delete, and like stories
- Responsive, modern UI with Tailwind CSS
- Publicly readable stories
- MongoDB for data storage
- Protected routes for story management

---

## Installation & Development

Follow these steps to set up Storied locally:

1. **Clone the repository:**
   ```bash
   git clone https://github.com/sonkamblesahil/StoryHub.git
   cd StoryHub
   ```

2. **Install backend dependencies:**
   ```bash
   cd backend
   npm install
   ```

3. **Install frontend dependencies:**
   ```bash
   cd ../frontend
   npm install
   ```

4. **Set up environment variables:**
   - Create a `.env` file in `backend` using `.env.example` as reference.
   - Example for backend:
     ```env
     PORT=3000
     MONGO_URL=your_mongodb_connection_string
     CLIENT_URL=http://localhost:5173
     ```

5. **Run the backend server:**
   ```bash
   cd backend
   npm start
   ```

6. **Run the frontend app (dev):**
   ```bash
   cd ../frontend
   npm run dev
   ```

---

## Production build & serve

1. Build the frontend:
   ```bash
   cd frontend
   npm install
   npm run build
   ```
2. Start the backend (serves `frontend/dist` and mounts API under `/api`):
   ```bash
   cd ../backend
   npm install
   npm run start
   ```
3. Set `CLIENT_URL` to your deployed origin(s). Multiple origins can be comma-separated.


## Features
- User authentication and profile management
- Create, edit, delete, and like stories
- Responsive, modern UI with Tailwind CSS
- Publicly readable stories
- MongoDB for data storage
- Protected routes for story management

---

## Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/sonkamblesahil/StoryHub.git
   cd StoryHub
   ```

2. **Install backend dependencies:**
   ```bash
   cd backend
   npm install
   ```

3. **Install frontend dependencies:**
   ```bash
   cd ../frontend
   npm install
   ```

4. **Set up environment variables:**
   - Create a `.env` file in both `backend` and `frontend` folders as needed.
   - Example for backend:
     ```env
     MONGO_URI=your_mongodb_connection_string
     JWT_SECRET=your_jwt_secret
     PORT=3000
     ```

5. **Run the backend server:**
   ```bash
   cd backend
   npm start
   ```

6. **Run the frontend app:**
   ```bash
   cd ../frontend
   npm run dev
   ```

---

## Project Structure
```
backend/
  controllers/
  models/
  routes/
  config/
  server.js
frontend/
  src/
  public/
  index.html
  vite.config.js
```

---

## Description
Storied is a platform where anyone can read stories, and registered users can share their own. The app features a clean, modern UI, profile management, and interactive story cards. Built with React, Express, MongoDB, and Node.js.

