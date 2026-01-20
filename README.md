# 📚 BookStore – MERN Stack Project

A full-stack MERN Bookstore platform featuring secure authentication, multi-role access control, and seller-specific dashboards.

This project focuses on real-world backend logic, including OAuth, cookie-based auth, MongoDB aggregation, and scalable frontend state management.


## 🚀 Live Demo

### Frontend 
🔗 https://bookstore-akshit.netlify.app

(“Initial load may take a few seconds due to free hosting cold start.”)


## ✨ Features

- 🔐 Secure authentication using HttpOnly cookies

- 🔑 Email/password + Google OAuth login

- 🧑‍💼 Role-based authorization

- 📚 Book management (CRUD)

- 🛒 Cart and order system

- 📦 Seller-specific order dashboards

- 📊 MongoDB aggregation pipelines for seller analytics

- ☁️ Cloudinary image uploads

- ⚡ React Query for server-state management

- 📄 Server-side pagination, sorting, and filtering

---

##  🛠️ Tech Stack

### Frontend

- React.js

- React Router

- React Query

- Context API

### Backend

- Node.js

- Express.js

- MongoDB (Mongoose)

- Mongoose

### Authentication

- JWT (HttpOnly cookies)

- Google OAuth 2.0

### Other Tools

- Cloudinary (image uploads)

- Git & GitHub

### Deployment

- Frontend: Netlify

- Backend: Render

- Database: MongoDB Atlas

---

## 👥 Roles Supported

- Admin – Full control over platform

- Seller – Manage own books and view related orders

- Operator – Operational access

- User – Browse and purchase books

-All permissions are enforced on the backend.

---

## 🧠 Backend Highlights

- JWT stored in cookies (no localStorage)

- Centralized auth middleware

- Conditional schema validation for OAuth users

- Aggregation pipelines for:

- seller orders

- seller revenue

- order-item breakdowns

- Shared backend for multiple frontends (Admin + Store)

---

## 📂 Project Structure (Simplified)

### backend
backend/ 
├─ controllers/ 
├─ routes/ 
├─ models/ 
├─ middleware/ 
└─ utils/

### frontend
frontend/ ├─ pages/ ├─ components/ ├─ context/ ├─ hooks/ └─ services/

---
## 🧪 Local Setup

- git clone https://github.com/sisodia-akshit/mern-bookstore
- cd mern-bookstore
- npm install
- npm run dev
Create a .env file based on .env.example.

---

## 🔐 Security Notes

- Tokens are never stored in frontend storage

- OAuth users do not require passwords

- All role checks are enforced server-side

---

## 📸 Screenshots

### Home Page
![Home Page](./screenshots/home.png)

### Book Details
![Book Details](./screenshots/book.png)

### Cart
![Cart](./screenshots/cart.png)

### Login / Register
![Auth](./screenshots/login.png)

### Admin Panel
![Admin](./screenshots/admin.png)

## Setup
### frontend
cd bookstore_frontend
npm install
npm start

### backend
cd bookstore_backend
npm install
npm run dev

## 🧑‍💻 Author

### Akshit Sisodia
### GitHub: https://github.com/sisodia-akshit
