# 🛒 Mini D-Mart — Full Stack Grocery Store Application

> SecurityBoat Round 2 Assessment — Full Stack Developer Practical Assessment

[![Java](https://img.shields.io/badge/Java-17-orange)](https://www.java.com/)
[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.3.5-green)](https://spring.io/projects/spring-boot)
[![React](https://img.shields.io/badge/React-18-blue)](https://reactjs.org/)
[![MySQL](https://img.shields.io/badge/MySQL-8.0-blue)](https://www.mysql.com/)
[![Vite](https://img.shields.io/badge/Vite-8.x-purple)](https://vitejs.dev/)

## 🌐 Live Deployments

- **Frontend Application (Vercel):** [https://security-boot-assignment.vercel.app](https://security-boot-assignment.vercel.app)
- **Backend API (Clever Cloud):** [https://app-3cb4fbc2-5c60-44a0-8577-2d18a1b8ade3.cleverapps.io](https://app-3cb4fbc2-5c60-44a0-8577-2d18a1b8ade3.cleverapps.io)
- **Database (Clever Cloud):** MySQL 8 Shared instance

---

## 📖 Project Overview

Mini D-Mart is a full-stack grocery store application that allows customers to browse products, manage their cart, place orders (store pickup / scheduled pickup / home delivery), and handle returns & exchanges. The platform supports four distinct roles with different levels of access and functionality.

### Key Highlights
- 🔐 **JWT-based authentication** with Role-Based Access Control (RBAC)
- 🛒 **Complete shopping flow**: browse → cart → checkout → order tracking
- 🔄 **Return & Exchange system** with 7-day eligibility window
- 🏪 **Staff & Manager dashboards** for order preparation and inventory
- 🛡️ **Security-first design**: pessimistic locking, audit logging, input validation
- 📊 **Admin panel** with user management and audit log viewer

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────┐
│                   React + Vite                       │
│              (Vercel — frontend)                     │
│   http://localhost:5173  (dev)                       │
└────────────────────┬────────────────────────────────┘
                     │ HTTP REST (Axios + JWT)
┌────────────────────▼────────────────────────────────┐
│              Spring Boot 3.3.5                       │
│         (Clever Cloud — backend)                     │
│   http://localhost:8080  (dev)                       │
└────────────────────┬────────────────────────────────┘
                     │ JPA / Hibernate
┌────────────────────▼────────────────────────────────┐
│                  MySQL 8.0                           │
│              Database: dmart_db                      │
└─────────────────────────────────────────────────────┘
```

---

## 👥 User Roles & RBAC

| Role | Description | Access |
|------|-------------|--------|
| **CUSTOMER** | Regular shoppers | Browse, cart, checkout, orders, returns, profile |
| **STAFF** | Store employees | Order queue, pickup management, return processing |
| **MANAGER** | Store managers | All staff access + inventory, reports |
| **ADMIN** | System administrators | Full access + user management, product CRUD, audit logs |

---

## 🔑 Test Credentials

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@dmart.com | Admin@123 |
| Manager | manager@dmart.com | Manager@123 |
| Staff | staff@dmart.com | Staff@123 |
| Customer | customer@dmart.com | Customer@123 |

> These credentials are auto-seeded when the application starts for the first time.

---

## 🚀 Getting Started

### Prerequisites
- Java 17+
- Maven 3.9+
- MySQL 8.0
- Node.js 18+
- npm 9+

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/mini-dmart.git
cd mini-dmart
```

### 2. Database Setup
```sql
CREATE DATABASE IF NOT EXISTS dmart_db;
```
MySQL runs on `localhost:3306` with user `root` (no password by default).

### 3. Backend Setup
```bash
cd backend

# Copy environment config
cp src/main/resources/application.properties.example src/main/resources/application.properties
# Edit DB credentials if needed

# Run the application
mvn spring-boot:run
```
Backend runs at **http://localhost:8080**

### 4. Frontend Setup
```bash
cd frontend

# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Start dev server
npm run dev
```
Frontend runs at **http://localhost:5173**

---

## 📁 Project Structure

```
mini-dmart/
├── backend/                          # Spring Boot application
│   ├── src/main/java/com/dmart/
│   │   ├── config/                   # CORS configuration
│   │   ├── controller/               # REST API controllers
│   │   │   ├── AuthController.java
│   │   │   ├── ProductController.java
│   │   │   ├── CartController.java
│   │   │   ├── OrderController.java
│   │   │   ├── ReturnController.java
│   │   │   ├── StaffController.java
│   │   │   ├── ManagerController.java
│   │   │   └── AdminController.java
│   │   ├── dto/                      # Request & Response DTOs
│   │   │   ├── request/
│   │   │   └── response/
│   │   ├── entity/                   # JPA entities
│   │   ├── enums/                    # Enumerations
│   │   ├── exception/                # Custom exceptions & handler
│   │   ├── repository/               # Spring Data JPA repositories
│   │   ├── security/                 # JWT, filters, security config
│   │   └── service/                  # Business logic services
│   └── src/main/resources/
│       └── application.properties
│
├── frontend/                         # React + Vite application
│   ├── src/
│   │   ├── api/                      # Axios API modules
│   │   ├── components/               # Reusable UI components
│   │   ├── context/                  # React Context (Auth)
│   │   └── pages/                    # All application pages
│   │       ├── public/               # Landing page
│   │       ├── auth/                 # Login, Register
│   │       ├── customer/             # Customer pages
│   │       ├── staff/                # Staff dashboard
│   │       ├── manager/              # Manager pages
│   │       └── admin/                # Admin pages
│   ├── .env
│   └── vercel.json
│
├── README.md
├── SECURITY.md
└── .env.example
```

---

## 🌐 API Documentation

Swagger UI is available at: **http://localhost:8080/swagger-ui/index.html**

### Core Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/register` | Public | Register new customer |
| POST | `/api/auth/login` | Public | Login, get JWT token |
| GET | `/api/auth/me` | Any | Current user info |
| GET | `/api/products` | Public | Browse products (search, filter) |
| GET | `/api/products/{id}` | Public | Product detail |
| GET | `/api/products/categories` | Public | All categories |
| GET | `/api/cart` | Customer | View cart |
| POST | `/api/cart/add` | Customer | Add to cart |
| POST | `/api/orders` | Customer | Place order |
| GET | `/api/orders` | Customer | My orders |
| PUT | `/api/orders/{id}/cancel` | Customer | Cancel order |
| POST | `/api/returns` | Customer | Create return/exchange |
| GET | `/api/staff/orders` | Staff+ | Pending orders queue |
| PUT | `/api/staff/orders/{id}/status` | Staff+ | Update order status |
| PUT | `/api/staff/returns/{id}/process` | Staff+ | Process return |
| GET | `/api/manager/inventory` | Manager+ | Inventory overview |
| PUT | `/api/manager/inventory` | Manager+ | Update stock |
| GET | `/api/admin/users` | Admin | All users |
| PUT | `/api/admin/users/{id}/role` | Admin | Assign role |
| GET | `/api/admin/audit-logs` | Admin | Audit logs |

---

## 🗄️ Database Design

### Key Tables

| Table | Description |
|-------|-------------|
| `users` | User accounts with roles |
| `categories` | Product categories |
| `products` | Products with stock & pricing |
| `cart_items` | Shopping cart items |
| `orders` | Customer orders |
| `order_items` | Individual items per order |
| `return_requests` | Return & exchange requests |
| `audit_logs` | Security audit trail |
| `inventory_logs` | Stock change history |

### Key Design Decisions
- **Pessimistic locking** on product stock during checkout to prevent race conditions
- **Soft delete** on products (set `active=false`) to preserve order history
- **`@Version`** field on Product for optimistic locking support
- Order table named `orders` (reserved word workaround)
- Audit logs capture IP address, action, entity type, and full details

---

## 🔐 Security Design

See [SECURITY.md](./SECURITY.md) for the full security documentation.

**Quick overview:**
- JWT tokens (24-hour expiry)
- BCrypt password hashing (strength 12)
- Role-based method security via Spring Security
- Bean Validation on all request inputs
- Global exception handler (no stack traces exposed)
- CORS restricted to known frontend origins
- Audit logging on all auth and state-changing operations

---

## 🚢 Deployment

### Frontend — Vercel
```bash
cd frontend
npm run build
# Deploy dist/ folder to Vercel
# vercel.json handles SPA routing
```

### Backend — Clever Cloud
1. Create a **Java + Maven** application in Clever Cloud.
2. Link your MySQL database add-on (`dmart-db`) as a service dependency to automatically inject database credentials.
3. Set `CC_MAVEN_SUBFOLDER` environment variable to `backend` (and configure `CC_JAVA_VERSION` to `21`).
4. Trigger the build using `clevercloud/maven.json` build descriptor in the root directory.

---

## 🧪 Testing

### Manual Test Flow

**Customer Flow:**
1. Register a new account → Login
2. Browse products, filter by category
3. Add items to cart
4. Checkout (choose pickup or delivery)
5. View order history, track status
6. After delivery: create return request

**Staff Flow:**
1. Login as `staff@dmart.com`
2. View pending orders queue
3. Update order status: PENDING → CONFIRMED → PREPARING → READY
4. Process pending return/exchange requests

**Manager Flow:**
1. Login as `manager@dmart.com`
2. View and update inventory stock levels
3. View sales statistics dashboard

**Admin Flow:**
1. Login as `admin@dmart.com`
2. Create/edit/deactivate products
3. Assign roles to users
4. View audit logs

---

## 🤖 AI Usage

This project was developed with assistance from **Google Deepmind's Antigravity AI** (Claude Sonnet 4.6 model):

| Task | AI Assistance |
|------|---------------|
| Project architecture & planning | AI suggested tech stack, RBAC design, API structure |
| Spring Boot backend | AI generated entity, service, controller, and security code |
| React frontend | AI generated all page components, routing, and design system |
| Edge case handling | AI implemented pessimistic locking, return eligibility, exchange stock checks |
| Documentation | AI drafted README and SECURITY.md |

All generated code was reviewed and integrated by the developer. The AI was used as a pair programmer, not a replacement for engineering judgment.
