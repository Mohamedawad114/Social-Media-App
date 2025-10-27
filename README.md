# 🚀 Social Media Platform (Node.js + TypeScript + OOP)

A *modern, scalable social media backend* built with *TypeScript, **Node.js, **Express, and **MongoDB*,  
featuring *OOP architecture, **Zod validation, **AWS S3 integration, **Redis caching, **Socket.io real-time chat*,  
and *secure OAuth2 authentication*.

---

## 🧩 Core Features

### 👤 User Management
- Register, login, and OAuth2 authentication.
- Email verification and resend flow.
- Change email with secure double verification.
- Encrypted phone numbers for privacy.
- Role-based access (user/admin).
- Account deletion and recovery.

---

### 📰 Posts & Comments
- Create, edit, and delete posts and comments.
- Fetch feeds (recent posts with pagination and filters).
- Media uploads (images, videos) via *AWS S3*.
- Feeds optimized using MongoDB indexes and aggregation.
- Cached friend and blacklist data using *Redis*.

---

### 🤝 Friends & Social Graph
- Send and accept friend requests.
- Manage and block/unblock users.
- Cached blacklist & friends list in Redis.
- Efficient search and suggestions.

---

### 💬 Real-Time Chat
- Built with *Socket.io* using *Gateway → Service → Event* design pattern:
  - *Gateway Layer* manages socket connections.
  - *Service Layer* holds chat logic.
  - *Event Layer* handles real-time broadcasting.
- Supports:
  - 1:1 private messaging.
  - Group chats with admin/member roles.
- Redis used for session, presence, and room management.

---

### 🧑‍💼 Admin System
- Freeze user accounts:
  - ⏳ *Periodic freeze* (temporary).
  - 🚫 *Strict freeze* (permanent).
- Delete user accounts.
- Access protected endpoints with role-based middleware.
- User moderation and audit logging.

---

### 🧠 Business Logic
- Email change verification (confirm new before apply).
- Phone encryption with hashing.
- Privacy handling for blocked users.
- Feed relevance sorting.
- Validation with *Zod* (strict runtime schema validation).

---

## ⚡ Performance & Security
- *Helmet* for secure HTTP headers.
- *Pino* for ultra-fast structured logging.
- *Redis* for caching and socket session management.
- *Zod* for data validation at API layer.
- *OAuth2 + JWT* for secure authentication.
- *Rate limiting* and input sanitization middleware.
- Strict *TypeScript typing* and OOP design for maintainability.

---

## 🧱 Architecture Overview
- *Layered OOP Architecture* → Controller / Service / Repository.
- *Gateway-Service-Event* pattern for WebSocket logic.
- *Dependency Injection* for scalability and testability.
- *REST + GraphQL APIs* working seamlessly.
- *AWS S3 integration* for media uploads.
- *Swagger UI* for automatic API documentation.

---

## 🧰 Tech Stack

| Layer | Technology |
|-------|-------------|
| *Language* | TypeScript |
| *Backend* | Node.js, Express |
| *Database* | MongoDB (Mongoose) |
| *Cache* | Redis |
| *Auth* | OAuth2, JWT |
| *Real-time* | Socket.io |
| *Validation* | Zod |
| *Storage* | AWS S3 |
| *Security* | Helmet, Encryption |
| *Docs* | Swagger |
| *Logging* | Pino |
| *Architecture* | OOP + Design Patterns |
| *Upcoming* | BullMQ, Notifications, Docker, AWS Deploy, Nginx Proxy |

---

## 🔜 Upcoming Features
- 📬 *BullMQ integration* for background email and notification queues.  
- 🔔 *Real-Time Notifications* for likes, comments, and requests.  
- 🐳 *Dockerized setup* for production deployment.  
- 🌐 *AWS + Nginx deployment* for scalability.  
- 🧾 *Analytics dashboard* for activity tracking.  
- 🧑‍💼 *Admin dashboard (React UI)* for moderation and management.

---
👉 http://localhost:3000/api-docs
to explore the Swagger API documentation.
## ⚙ Installation

bash
# Clone the repo
git clone https://github.com/Mohamedawad114/Social-Media-App.git

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env

# Run development server
npm run dev
