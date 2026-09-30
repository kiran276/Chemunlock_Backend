# ⚗️ Chem-Unlock Backend API

<p align="left">
  <img src="https://img.shields.io/badge/Node.js-20.x-339933?style=flat-square&logo=nodedotjs&logoColor=white" alt="Node.js" />
  <img src="https://img.shields.io/badge/Express-5.x-000000?style=flat-square&logo=express&logoColor=white" alt="Express" />
  <img src="https://img.shields.io/badge/MongoDB-Atlas-47A248?style=flat-square&logo=mongodb&logoColor=white" alt="MongoDB" />
  <img src="https://img.shields.io/badge/Auth-JWT_%26_Bcrypt-blue?style=flat-square&logo=jsonwebtokens&logoColor=white" alt="JWT" />
  <img src="https://img.shields.io/badge/Uploads-Multer-orange?style=flat-square" alt="Multer" />
</p>

> A lightweight, modular REST API backend for **Chem-Unlock** — a digital chemistry course & notes marketplace.

---

## 📖 Table of Contents

- [Overview](#-overview)
- [Tech Stack](#-tech-stack)
- [Project Architecture](#-project-architecture)
- [Environment Setup](#-environment-setup)
- [Quick Start](#-quick-start)
- [API Endpoints](#-api-endpoints)
  - [Health Check](#1-health-check)
  - [Authentication](#2-authentication-routes-apiauth)
  - [Courses](#3-course-routes-apicourses)
- [File Upload Details](#-file-upload-details)
- [Testing with cURL](#-testing-with-curl)

---

## 🌟 Overview

Chem-Unlock allows:
- **Teachers** to publish PDF notes/courses with card covers and preview screenshots.
- **Students** to register, browse courses, view preview samples, and purchase notes.

> **Key Rule**: Course PDF URLs (`pdfUrl`) are protected assets and never exposed via public endpoints.

---

## 🛠 Tech Stack

| Component | Technology | Description |
| :--- | :--- | :--- |
| **Runtime** | Node.js | Fast, asynchronous JavaScript runtime |
| **Framework** | Express.js | Minimal and flexible web application framework |
| **Database** | MongoDB | Document database via Mongoose ODM |
| **Auth** | JWT + bcryptjs | Token-based stateless authentication & password hashing |
| **Uploads** | Multer | Disk storage for cover cards & preview images |

---

## 📂 Project Architecture

```plaintext
Backend/
├── config/
│   └── db.js                    # MongoDB connection
├── controllers/
│   ├── authController.js        # Auth logic (register, login, me, logout)
│   └── courseController.js      # Course CRUD & ownership checks
├── middleware/
│   ├── authMiddleware.js        # JWT verifyToken middleware
│   ├── roleMiddleware.js        # Role guards (teacherOnly, studentOnly)
│   ├── uploadMiddleware.js      # Multer image upload handler
│   └── errorMiddleware.js       # Central error & 404 handler
├── models/
│   ├── User.js                  # User schema (student / teacher)
│   └── Course.js                # Course schema (card, previews, pdfUrl, teacher)
├── routes/
│   ├── authRoutes.js            # /api/auth router
│   └── courseRoutes.js          # /api/courses router
├── uploads/
│   ├── cards/                   # Card cover images
│   └── previews/                # PDF preview screenshots
├── utils/
│   └── generateToken.js         # JWT generator helper
├── app.js                       # Express app configuration
├── server.js                    # Server entrypoint
├── package.json
└── .env
```

---

## ⚙️ Environment Setup

Create a `.env` file in the root folder:

```env
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/chem-unlock
JWT_SECRET=your_super_secret_jwt_key
CLIENT_URL=http://localhost:5173
```

> 💡 **MongoDB Atlas Tip**: If you get a connection error, make sure your current IP address is whitelisted in [MongoDB Atlas Network Access](https://cloud.mongodb.com) (or allow `0.0.0.0/0` during development).

---

## 🚀 Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Run in development mode (with auto-reload)
npm run dev

# 3. Run in production mode
npm start
```

Default Server URL: `http://localhost:5000`

---

## 📡 API Endpoints

### 1. Health Check

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/health` | Public | Check if API server is online |

```json
// GET /api/health
{
  "success": true,
  "message": "Chem-Unlock API is running"
}
```

---

### 2. Authentication Routes (`/api/auth`)

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Public | Register student or teacher |
| `POST` | `/api/auth/login` | Public | Login & receive JWT |
| `POST` | `/api/auth/logout` | Public | Clear session |
| `GET` | `/api/auth/me` | Logged In | Get profile of logged-in user |

<details>
<summary><b>🔍 View Auth Request & Response Payloads</b></summary>

#### `POST /api/auth/register`
```json
// Request Body
{
  "name": "Walter White",
  "email": "teacher@chem-unlock.com",
  "password": "password123",
  "role": "teacher" // "teacher" or "student" (default)
}

// Response (201 Created)
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": "6701a5b8e4b0a1a2b3c4d5e6",
      "name": "Walter White",
      "email": "teacher@chem-unlock.com",
      "role": "teacher",
      "createdAt": "2026-09-29T12:00:00.000Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

#### `POST /api/auth/login`
```json
// Request Body
{
  "email": "teacher@chem-unlock.com",
  "password": "password123"
}

// Response (200 OK)
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": "6701a5b8e4b0a1a2b3c4d5e6",
      "name": "Walter White",
      "email": "teacher@chem-unlock.com",
      "role": "teacher"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```
</details>

---

### 3. Course Routes (`/api/courses`)

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/courses` | Public | List all courses (`pdfUrl` excluded) |
| `GET` | `/api/courses/:id` | Public | Course details (`pdfUrl` excluded) |
| `GET` | `/api/courses/teacher/my-courses` | Teacher | List courses owned by logged-in teacher |
| `POST` | `/api/courses` | Teacher | Create course with card & preview images |
| `PUT` | `/api/courses/:id` | Teacher (Owner) | Edit course details/images |
| `DELETE` | `/api/courses/:id` | Teacher (Owner) | Delete course |

<details>
<summary><b>🔍 View Course Request & Response Payloads</b></summary>

#### `GET /api/courses` (Public Listing)
```json
// Response (200 OK)
{
  "success": true,
  "count": 1,
  "data": [
    {
      "_id": "6701c900e4b0a1a2b3c4d5e7",
      "title": "Complete Organic Chemistry — Class 12",
      "description": "Complete organic chemistry notes covering reactions & mechanisms.",
      "price": 199,
      "previewImages": [
        "/uploads/previews/1727610000000-sample1.jpg"
      ],
      "teacher": {
        "_id": "6701a5b8e4b0a1a2b3c4d5e6",
        "name": "Walter White",
        "email": "teacher@chem-unlock.com"
      },
      "createdAt": "2026-09-29T12:30:00.000Z"
    }
  ]
}
```

#### `POST /api/courses` (Teacher Only)
- **Header**: `Authorization: Bearer <TEACHER_JWT_TOKEN>`
- **Content-Type**: `multipart/form-data`

| Field | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `title` | Text | Yes | Name of course/notes |
| `description` | Text | Yes | Course summary |
| `price` | Number | Yes | Price in ₹ (e.g. 199) |
| `pdfUrl` | Text | Yes | Hosted PDF link |
| `previewImages` | File(s) | No | Up to 5 preview sample images |

</details>

---

## 🖼 File Upload Details

- **Preview Screenshots**: Saved to `/uploads/previews/` (Max 5 files).
- **Allowed Extensions**: `.jpg`, `.jpeg`, `.png`, `.webp`.
- **Max File Size**: 5 MB per image.
- **Static URL**: All uploads accessible via `http://localhost:5000/uploads/...`

---

## 🧪 Testing with cURL

```bash
# 1. Health check
curl http://localhost:5000/api/health

# 2. Register as Teacher
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Prof. Walter","email":"teacher@chem.com","password":"password123","role":"teacher"}'

# 3. Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"teacher@chem.com","password":"password123"}'

# 4. Create Course (Replace <TOKEN> with JWT from login)
curl -X POST http://localhost:5000/api/courses \
  -H "Authorization: Bearer <TOKEN>" \
  -F "title=Organic Chemistry Class 12" \
  -F "description=Complete notes and reaction mechanisms." \
  -F "price=199" \
  -F "pdfUrl=https://storage.example.com/notes.pdf" \
  -F "previewImages=@/path/to/preview1.jpg"

# 5. Get Public Courses
curl http://localhost:5000/api/courses
```

---

<p align="center">Made with ❤️ for <b>Chem-Unlock</b></p>
