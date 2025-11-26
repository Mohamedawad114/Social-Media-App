*🚀 Social Media Platform (Node.js + TypeScript + OOP)
A modern, scalable social media backend built with TypeScript, Node.js, Express, and MongoDB,
featuring OOP architecture, Zod validation, AWS S3 integration, Redis caching, Socket.io real-time chat,
and secure OAuth2 authentication.*

🧩 Core Features
👤 User Management
Register, login, and OAuth2 authentication.
Email verification and resend flow.
Change email with secure double verification.
Encrypted phone numbers for privacy.
Role-based access (user/admin).
Account deletion and recovery.

📰 Posts & Comments
Create, edit, and delete posts and comments.

Fetch feeds (recent posts with pagination and filters).

Media uploads (images, videos) via AWS S3.

Feeds optimized using MongoDB indexes and aggregation.

Cached friend and blacklist data using Redis.

🤝 Friends & Social Graph
Send and accept friend requests.

Manage and block/unblock users.

Cached blacklist & friends list in Redis.

Efficient search and suggestions.

💬 Real-Time Chat
Built with Socket.io using Gateway → Service → Event design pattern:

Gateway Layer manages socket connections.

online/offline users

Service Layer holds chat logic.

Event Layer handles real-time broadcasting.

Supports:

1:1 private messaging.

Group chats with admin/member roles.

Redis used for session, presence, and room management.

🔔 Real-Time Notifications (New)
Real-time push notifications using Socket.io.

Support for:

Likes

Comments

Friend requests

Admin actions

Notification system returns:

All notifications (read)

Unread-only notifications

delete all read notifications

Automatic state update from unread → read when fetched.

Integrated with Redis for fast access.

📬 Email Queue System (BullMQ) (New)
Background job processing using BullMQ.

Dedicated queues for:

Email verification

Password recovery

Notification emails

Redis-backed queues for reliability and performance.

Worker processes run independently and scale inside Docker.

🐳 Dockerized Setup (New)
Full production-ready Docker setup including:

Node.js App running on port 5000

Redis container for:

caching

BullMQ

socket presence

Docker Compose orchestration

Dev + Prod Dockerfiles

Healthchecks for app and Redis

Run everything with:

docker-compose up --build
🧑‍💼 Admin System
Freeze user accounts (temporary/permanent).

Delete user accounts.

Moderation tools.

Role-based protected routes.

Full audit logs.

🧠 Business Logic
Email change verification workflow.

Phone encryption with hashing.

Privacy handling with blocking logic.

Feed scoring algorithm.

Zod validation for strict runtime checking.

⚡ Performance & Security
Helmet for secure HTTP headers.

Pino for high-performance logging.

Redis for caching and socket sessions.

OAuth2 + JWT for secure authentication.

Rate limiting + sanitization.

Strict TypeScript types and OOP structure.

*for testing*

-- use k6 for test the load

🧱 Architecture Overview
Layered OOP Architecture → Controller / Service / Repository.

Gateway-Service-Event pattern for WebSockets.

Dependency Injection.

REST + GraphQL APIs.

AWS S3 file storage.

Swagger for API documentation.

🧰 Tech Stack
Layer	Technology
Language	TypeScript
Backend	Node.js, Express
Database	MongoDB (Mongoose)
Cache	Redis
Auth	OAuth2, JWT
Real-time	Socket.io
Notifications	Socket.io + Redis (New)
Queue	BullMQ (New)
Validation	Zod
Storage	AWS S3
Security	Helmet
Docs	Swagger
Logging	Pino
Deployment	Docker (New)
Process Manager	PM2 (New)
Reverse Proxy	Nginx (New)
Hosting	AWS EC2 (New)
⚙ Deployment Plan (New)
The project will be deployed on:

🟩 AWS EC2 (Ubuntu server)
Using:

Nginx reverse proxy

PM2 to keep Node server alive

Docker for Redis & Workers

Auto-restart on crash

SSL via Certbot (Let's Encrypt)

🔜 Upcoming Features
📬 BullMQ automation workflows.

🔔 Advanced real-time notification center.

🐳 Full production-grade Docker images.

🌐 AWS Load Balancer & auto-scaling.

📊 Analytics dashboard.

🧑‍💼 Admin panel (React).

 live for test:http://16.171.119.160/api

👉 docs: http://localhost:3000/api-docs

⚙ Installation
# Clone the repo
git clone https://github.com/Mohamedawad114/Social-Media-App.git

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env

# Run in development
npm run dev
