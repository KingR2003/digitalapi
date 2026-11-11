# Quiz Application with Credit-Staking System

A fullstack quiz platform where users stake virtual credits to enter timed quizzes and earn reward payouts for passing. Built as part of the **DigitalAPICraft Fullstack Developer Interview Assignment**.

---

## Live Demo

| Service | URL |
|---------|-----|
| **Frontend (Vercel)** | [https://digitalapi-phi.vercel.app](https://digitalapi-phi.vercel.app) |
| **Backend API (AWS)** | `http://18.61.68.209:8080` |
| **Swagger / OpenAPI Docs** | [http://18.61.68.209:8080/swagger-ui.html](http://18.61.68.209:8080/swagger-ui.html) |
| **DigitalAPI Gateway** | Published on [trial.digitalapi.ai](https://trial.digitalapi.ai) |

---

## Demo Credentials

| Role | Email | Password | Initial Credits |
|------|-------|----------|-----------------|
| Regular User | `user@digitalapi.com` | `user123` | 500 |
| Admin | `admin@digitalapi.com` | `admin123` | 5,000 |

> The **Admin** account has access to the **Admin Studio** tab where you can create quizzes, manage question banks, and view all quiz data. Regular users can browse quizzes, stake credits, take timed quizzes, and review their attempt history.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Backend** | Java 17, Spring Boot 3.3.5, Spring Security, Spring Data JPA |
| **Frontend** | React 18, Vite, Tailwind CSS |
| **Database** | PostgreSQL 16 (production), H2 in-memory (local dev) |
| **Auth** | JWT Bearer tokens (HMAC-SHA384, 24h expiry) |
| **API Docs** | SpringDoc OpenAPI 3.0 with Swagger UI |
| **Containerization** | Docker multi-stage builds, Docker Compose |
| **Cloud Hosting** | AWS ECS Fargate (Hyderabad, ap-south-2) |
| **Frontend Hosting** | Vercel (Edge Network) |
| **API Gateway** | DigitalAPI Gateway (trial.digitalapi.ai) |

### Why AWS Instead of GCP

The assignment originally recommended GCP Cloud Run for deployment. However, I ran into billing and account activation issues on GCP that prevented me from deploying containers there in time. To keep things moving, I switched to **AWS ECS with Fargate** — which is functionally equivalent to Cloud Run. Both are serverless container platforms that scale from zero, pull images from a container registry (ECR / Artifact Registry), and expose HTTP endpoints with zero infrastructure management. The application itself is completely cloud-agnostic and can be deployed to either platform without any code changes.

---

## Architecture Overview

```
┌─────────────┐     ┌──────────────────┐     ┌──────────────────────┐
│  React SPA  │────▶│  Vercel Edge     │────▶│  Spring Boot API     │
│  (Vite)     │     │  (Reverse Proxy) │     │  (AWS ECS Fargate)   │
└─────────────┘     └──────────────────┘     │                      │
                                              │  ┌────────────────┐ │
                                              │  │ JWT Auth Filter │ │
                                              │  └───────┬────────┘ │
                                              │          ▼          │
                                              │  ┌────────────────┐ │
                                              │  │ REST Controllers│ │
                                              │  └───────┬────────┘ │
                                              │          ▼          │
                                              │  ┌────────────────┐ │
                                              │  │ Service Layer   │ │
                                              │  │ (Tx + Locking)  │ │
                                              │  └───────┬────────┘ │
                                              │          ▼          │
                                              │  ┌────────────────┐ │
                                              │  │ H2 / PostgreSQL│ │
                                              │  └────────────────┘ │
                                              └──────────────────────┘
```

---

## Key Features

### Credit Wallet System
- Every new user receives **500 bonus credits** on registration.
- Users stake credits to enter quizzes and earn reward payouts for passing.
- **Mock payment gateway** lets users top up credits with idempotency key protection to prevent duplicate charges.
- Full **immutable transaction ledger** — every credit movement (bonus, stake, reward, purchase) is recorded as an append-only audit trail.

### Pessimistic Database Locking
- The wallet uses `SELECT ... FOR UPDATE` (pessimistic write locks) to prevent race conditions during concurrent credit operations.
- Database-level `CHECK` constraints ensure the balance can never go negative — even under concurrent load.
- Quiz attempt submissions are also locked to prevent double-submit exploits.

### Quiz Engine
- Timed quiz sessions with automatic expiry.
- Randomized question delivery (answers are never sent to the client).
- Immediate grading with detailed question-by-question review and explanations.
- Attempt history tracking with scores and credit outcomes.

### Role-Based Access Control
- **ROLE_USER**: Browse quizzes, stake credits, take quizzes, view wallet and transaction history.
- **ROLE_ADMIN**: Everything above, plus create/edit/delete quizzes, manage question banks, and view questions with correct answers.
- Enforced at both the Spring Security filter level and the controller level.

### API Documentation
- Full OpenAPI 3.0 specification auto-generated by SpringDoc.
- Interactive Swagger UI available at `/swagger-ui.html`.
- API published and accessible through the DigitalAPI Gateway.

---

## API Endpoints

### Authentication
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/v1/auth/register` | Public | Register a new user (receives 500 bonus credits) |
| POST | `/api/v1/auth/login` | Public | Login and receive JWT token |

### Credit Wallet
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/v1/wallet/balance` | Bearer | Get current credit balance |
| GET | `/api/v1/wallet/transactions` | Bearer | View paginated transaction ledger |
| POST | `/api/v1/wallet/mock-buy` | Bearer | Purchase credits (supports Idempotency-Key header) |

### Quizzes
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/v1/quizzes` | Public | List all available quizzes |
| POST | `/api/v1/quizzes/{id}/start` | Bearer | Stake credits and start a quiz attempt |
| POST | `/api/v1/quizzes/attempts/{id}/submit` | Bearer | Submit answers and receive graded results |
| GET | `/api/v1/quizzes/attempts/me` | Bearer | View personal attempt history |

### Admin (ROLE_ADMIN only)
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/v1/admin/quizzes` | Admin | List all quizzes |
| POST | `/api/v1/admin/quizzes` | Admin | Create a new quiz |
| PUT | `/api/v1/admin/quizzes/{id}` | Admin | Update quiz details |
| DELETE | `/api/v1/admin/quizzes/{id}` | Admin | Delete a quiz |
| GET | `/api/v1/admin/quizzes/{id}/questions` | Admin | View questions with correct answers |
| POST | `/api/v1/admin/quizzes/{id}/questions` | Admin | Add a question to a quiz |
| DELETE | `/api/v1/admin/quizzes/{quizId}/questions/{questionId}` | Admin | Remove a question |

---

## Running Locally

### Prerequisites
- Java 17+
- Node.js 18+
- Maven 3.9+

### Backend
```bash
cd backend
mvn spring-boot:run
```
The API starts on `http://localhost:8080` with an in-memory H2 database. Test data (users, quizzes, questions) is automatically seeded on first launch.

### Frontend
```bash
cd frontend
npm install
npm run dev
```
Opens at `http://localhost:5173`. The Vite dev server proxies all `/api` requests to `localhost:8080`.

### Docker Compose (Full Stack)
```bash
docker compose up --build
```
Starts PostgreSQL 16 + Spring Boot backend + Nginx frontend:
- Frontend: `http://localhost:3000`
- Backend: `http://localhost:8080`

---

## Project Structure

```
digitalapi/
├── backend/
│   ├── src/main/java/com/digitalapicraft/quizapi/
│   │   ├── config/          # Security, JWT, CORS, OpenAPI, data seeding
│   │   ├── controller/      # REST controllers (Auth, Wallet, Quiz, Admin)
│   │   ├── dto/             # Request/Response DTOs
│   │   ├── entity/          # JPA entities (User, Wallet, Quiz, Question, etc.)
│   │   ├── exception/       # Global exception handler + custom exceptions
│   │   ├── repository/      # Spring Data JPA repositories (with pessimistic locks)
│   │   └── service/         # Business logic (AuthService, WalletService, QuizService)
│   ├── src/test/java/       # Unit and integration tests
│   ├── Dockerfile           # Multi-stage build (Maven → JRE Alpine)
│   └── pom.xml
├── frontend/
│   ├── src/
│   │   ├── components/      # React UI components
│   │   ├── api.js           # Centralized API client with JWT interceptor
│   │   ├── App.jsx          # Main application shell
│   │   └── main.jsx         # Entry point
│   ├── Dockerfile           # Multi-stage build (Node → Nginx)
│   ├── nginx.conf           # Reverse proxy config for Docker deployment
│   └── vercel.json          # Vercel rewrite rules (proxy /api to AWS backend)
├── docker-compose.yml       # Full stack orchestration (Postgres + Backend + Frontend)
├── openapi.yaml             # OpenAPI 3.0 specification
└── openapi.json             # OpenAPI 3.0 specification (JSON)
```

---

## Testing

The project includes several test suites under `backend/src/test/`:

- **AuthControllerTest** — Registration flow (500 credit bonus), login, invalid credential handling.
- **QuizServiceTest** — Full quiz lifecycle: stake deduction, answer submission, reward distribution, and insufficient balance rollback.
- **WalletServiceConcurrencyTest** — Multi-threaded concurrent deduction tests, double-submit prevention, and idempotent mock buy verification.
- **ApiIntegrationTest** — End-to-end MockMvc tests covering public access, authentication, role-based authorization, and admin CRUD operations.

Run all tests:
```bash
cd backend
mvn test
```

---

## Credit Consistency Deep Dive

This section covers the approach taken to handle credit consistency — one of the core requirements of this assignment.

### The Problem
In a system where users stake credits to enter quizzes, you need to guarantee that:
1. A user's balance never goes negative, even under concurrent requests.
2. No credits are lost or duplicated during stake/reward operations.
3. Network retries don't cause double charges.

### The Solution

**1. Pessimistic Write Locking**
- The `WalletRepository` uses `@Lock(PESSIMISTIC_WRITE)` on the `findByUserIdForUpdate` query, which translates to `SELECT ... FOR UPDATE` in SQL.
- This locks the wallet row at the database level while a transaction is in progress, blocking any concurrent reads or writes to the same row until the transaction commits or rolls back.
- This eliminates race conditions where two concurrent requests could both read a stale balance and both succeed.

**2. Database CHECK Constraints**
- The `Wallet` entity has a `@Check(constraints = "balance >= 0")` annotation, which translates to a SQL constraint.
- Even if application-level validation fails, the database itself rejects any update that would make the balance negative.
- This acts as a safety net — a second line of defense.

**3. Immutable Audit Ledger**
- Every credit movement is recorded as a `WalletTransaction` entry. These records are append-only and never modified or deleted.
- Each transaction stores the `amount`, `balanceAfter`, `type`, a `referenceId`, and a `description`.
- The ledger can be independently verified: the sum of all transaction amounts for a wallet should always equal the current balance.

**4. Idempotency Keys**
- The mock-buy endpoint accepts an optional `Idempotency-Key` header.
- Before processing a purchase, the service checks if a transaction with that key already exists. If it does, it returns the existing result instead of creating a duplicate.
- The `idempotency_key` column has a unique constraint at the database level to enforce this.

**5. Atomic Quiz Flow**
- Starting a quiz: create the attempt record first, then deduct the stake in a single `@Transactional` method. If the deduction fails, the entire transaction (including the attempt creation) rolls back automatically.
- Submitting a quiz: the attempt is loaded with a pessimistic lock to prevent double-submit. The status is checked and updated atomically within the same transaction.
