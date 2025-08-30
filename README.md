
# StoryHub

StoryHub is a full-stack MERN web application for sharing, discovering, and managing stories. Users can sign up, build profiles, and create, update, or delete their own stories. All stories are publicly readable, so visitors can browse without logging in. The platform features:

- User authentication and profile management
- Create, edit, delete, and like stories
- Responsive, modern UI with Tailwind CSS
- Publicly readable stories
- MongoDB for data storage
- Protected routes for story management

---

## Installation

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

