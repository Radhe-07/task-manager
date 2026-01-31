# Task Manager (React + Express + MongoDB)

A simple full-stack task manager application built with **React**, **Express**, and **MongoDB**.  
Users can create, edit, mark tasks as complete, and delete them.

The project is structured as a single repository with separate frontend and backend folders.

---

## Tech Stack

### Frontend
- React
- TypeScript
- Vite
- CSS

### Backend
- Node.js
- Express
- MongoDB (Mongoose)

### Deployment
- Backend: Render
- Frontend: Netlify
- Database: MongoDB Atlas

---

## Project Structure
```text
task-manager/
├── frontend/ # React frontend
├── backend/ # Express backend
├── .gitignore
└── README.md
```

---

## Features

- Create tasks with title and description
- Edit pending tasks
- Mark tasks as completed
- Completed tasks are visually distinguished
- Delete tasks
- REST API with CRUD operations
- Environment-based configuration for deployment

---

## Local Setup

### 1. Clone the repository

```bash
git clone https://github.com/<your-username>/task-manager.git
cd task-manager
```

### 2. Backend setup
```bash
cd backend
npm install
node index.js
```
### Add environment variables for backend
```bash
MONGO_URI="your-mongo-connection-string"
```

### 3. frontend setup 

```bash
cd frontend
npm install
npm run dev
```

### Add environment variables for frontend 
```bash
VITE_API_BASE_URL="your backend url"
```

