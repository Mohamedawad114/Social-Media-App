
# 🚀 Social Media Platform (Node.js + TypeScript + MongoDB)

A *scalable, production-grade social media backend* built with *TypeScript, **Node.js, **Express, and **MongoDB* —  
featuring a clean *OOP architecture, **Redis caching, **real-time chat, and **secure authentication*.

---

## 🧩 Core Features

### 👤 User System
- Register, login, and OAuth2 authentication.
- Email verification (send + verify).
- Change email with confirmation flow.
- Encrypted phone numbers for security.
- Role-based access control (user / admin).
- Account deletion and recovery system.

---

### 📰 Posts & Comments
- Create, update, delete posts and comments.
- Feeds system showing the latest posts.
- Filtering, pagination, and sorting.
- Linked comments with post caching for fast load.

---

### 🤝 Friends & Blacklist
- Send and manage friend requests.
- Accept, reject, or remove friends.
- Block/unblock users (Blacklist System).
- Cached in *Redis* per user for instant access.

---

### 💬 Real-Time Chat
- Implemented using *Socket.io* with a clean *Gateway → Service → Event* structure.
- Supports:
  - 1:1 private chats.
  - Group chats with admins and members.
- Handles message delivery, read receipts, and persistence.
- Redis used for room/user mapping and status tracking.

---

### 🧑‍💼 Admin Features
- *Freeze user accounts*:
  - ⏳ Period freeze (temporary restriction).
  - 🚫 Strict freeze (permanent restriction).
- *Delete user accounts* permanently.
- Manage users, groups, and content moderation.
- Protected admin APIs via role-based middleware.

---

### 🧠 Business Logic
- Secure email change verification with dual confirmation.
- Friend request & blocking logic.
- Phone encryption & validation.
- Feed generation logic.
- User search & recommendations.

---

## ⚡ Performance & Security
- *Helmet* for secure HTTP headers.
- *Pino* for high-speed structured logging.
- *Redis Cache* for hot data (friends, blacklist, feeds).
- *OAuth2 + JWT* authentication.
- *Rate limiting* and validation middleware.
- *OOP-based TypeScript* with strong typing for maintainability.

---

## 🧱 Architecture Overview

### 🧩 Design Pattern & Structure
- *Layered OOP architecture*:
  - Controllers handle requests/responses.
  - Services manage business logic.
  - Repositories abstract database logic.
- *Gateway-Service-Event* structure for WebSocket management.
- *Dependency injection* pattern for scalability.
- *REST + GraphQL APIs* working together for flexible client usage.

---

## 🧰 Tech Stack

| Layer | Technology |
|-------|-------------|
| *Language* | TypeScript |
| *Backend* | Node.js + Express |
| *Database* | MongoDB (Mongoose) |
| *Cache* | Redis |
| *Auth* | OAuth2, JWT |
| *Real-time* | Socket.io |
| *Security* | Helmet, Encryption |
| *Docs* | Swagger |
| *Logging* | Pino |
| *Pattern* | OOP + Design Patterns |
| *Upcoming* | BullMQ (background jobs), Real-time Notifications |

---

## 🔜 Upcoming Features
- 📬 *BullMQ integration* for queued email jobs and background tasks.  
- 🔔 *Real-time notifications* for likes, comments, and friend requests.  
- 📈 *User analytics & activity tracking.*  
- 🧑‍💼 *Admin dashboard* for moderation and statistics.  
- 🧱 *Microservices structure* with message queues (Kafka/RabbitMQ).

---

## ⚙ Installation

bash
# Clone the repo
git clone https://github.com/yourusername/social-media-platform.git

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env

# Run development server
npm run dev
# 🚀 Social Media Platform (Node.js + TypeScript + MongoDB)

A **scalable, production-grade social media backend** built with **TypeScript**, **Node.js**, **Express**, and **MongoDB** —  
featuring a clean **OOP architecture**, **Redis caching**, **real-time chat**, and **secure authentication**.

---

## 🧩 Core Features

### 👤 User System
- Register, login, and OAuth2 authentication.
- Email verification (send + verify).
- Change email with confirmation flow.
- Encrypted phone numbers for security.
- Role-based access control (user / admin).
- Account deletion and recovery system.

---

### 📰 Posts & Comments
- Create, update, delete posts and comments.
- Feeds system showing the latest posts.
- Filtering, pagination, and sorting.
- Linked comments with post caching for fast load.

---

### 🤝 Friends & Blacklist
- Send and manage friend requests.
- Accept, reject, or remove friends.
- Block/unblock users (Blacklist System).
- Cached in **Redis** per user for instant access.

---

### 💬 Real-Time Chat
- Implemented using **Socket.io** with a clean **Gateway → Service → Event** structure.
- Supports:
  - 1:1 private chats.
  - Group chats with admins and members.
- Handles message delivery, read receipts, and persistence.
- Redis used for room/user mapping and status tracking.

---

### 🧑‍💼 Admin Features
- **Freeze user accounts**:
  - ⏳ Period freeze (temporary restriction).
  - 🚫 Strict freeze (permanent restriction).
- **Delete user accounts** permanently.
- Manage users, groups, and content moderation.
- Protected admin APIs via role-based middleware.

---

### 🧠 Business Logic
- Secure email change verification with dual confirmation.
- Friend request & blocking logic.
- Phone encryption & validation.
- Feed generation logic.
- User search & recommendations.

---

## ⚡ Performance & Security
- **Helmet** for secure HTTP headers.
- **Pino** for high-speed structured logging.
- **Redis Cache** for hot data (friends, blacklist, feeds).
- **OAuth2 + JWT** authentication.
- **Rate limiting** and validation middleware.
- **OOP-based TypeScript** with strong typing for maintainability.

---

## 🧱 Architecture Overview

### 🧩 Design Pattern & Structure
- **Layered OOP architecture**:
  - `Controllers` handle requests/responses.
  - `Services` manage business logic.
  - `Repositories` abstract database logic.
- **Gateway-Service-Event** structure for WebSocket management.
- **Dependency injection** pattern for scalability.
- **REST + GraphQL APIs** working together for flexible client usage.

---

## 🧰 Tech Stack

| Layer | Technology |
|-------|-------------|
| **Language** | TypeScript |
| **Backend** | Node.js + Express |
| **Database** | MongoDB (Mongoose) |
| **Cache** | Redis |
| **Auth** | OAuth2, JWT |
| **Real-time** | Socket.io |
| **Security** | Helmet, Encryption |
| **Docs** | Swagger |
| **Logging** | Pino |
| **Pattern** | OOP + Design Patterns |
| **Upcoming** | BullMQ (background jobs), Real-time Notifications |

---

## 🔜 Upcoming Features
- 📬 **BullMQ integration** for queued email jobs and background tasks.  
- 🔔 **Real-time notifications** for likes, comments, and friend requests.  
- 📈 **User analytics & activity tracking.**  
- 🧑‍💼 **Admin dashboard** for moderation and statistics.  
- 🧱 **Microservices structure** with message queues (Kafka/RabbitMQ).

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
