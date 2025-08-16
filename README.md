# 🏛️ Civic-Sphere-API

<div align="center">

![Node.js](https://img.shields.io/badge/Node.js-18+-green?style=for-the-badge&logo=node.js)
![Express](https://img.shields.io/badge/Express-4.21+-black?style=for-the-badge&logo=express)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-13+-blue?style=for-the-badge&logo=postgresql)
![TypeScript](https://img.shields.io/badge/TypeScript-5.3+-blue?style=for-the-badge&logo=typescript)
![Drizzle](https://img.shields.io/badge/Drizzle-0.36+-orange?style=for-the-badge&logo=drizzle)
![Swagger](https://img.shields.io/badge/Swagger-3.0+-green?style=for-the-badge&logo=swagger)

**A robust, production-ready Node.js + Express API for managing civic infrastructure with role-based access control**

[📚 API Docs](#api-documentation) • [🔧 Setup](#getting-started) • [📖 Features](#-features)

</div>

---

## ✨ Overview

Civic-Sphere-API is a comprehensive backend solution designed for government and civic organizations to manage departments, users, and districts efficiently. Built with modern technologies and best practices, it provides a scalable foundation for civic management systems.

### 🎯 **What This API Solves**
- **Centralized Management**: Single API for all civic operations
- **Role-Based Access**: Secure, hierarchical user permissions
- **Scalable Architecture**: Built to handle growing civic infrastructure
- **Developer Experience**: Full Swagger documentation and SDK generation
- **Production Ready**: Includes logging, validation, and error handling

---

## 🚀 Features

### 🔐 **Authentication & Security**
- **JWT-based Authentication** with refresh token support
- **Role-Based Access Control** (Super Admin, Admin, User)
- **OTP Verification** for secure login
- **Password Hashing** with bcrypt
- **Input Validation** using Zod schemas

### 🏢 **Core Functionality**
- **Department Management** - Create, update, list, and manage departments
- **User Management** - Full CRUD operations with role assignments
- **District Management** - Geographic organization and user linkage
- **Dashboard Analytics** - Business intelligence and reporting

### 🛠️ **Developer Experience**
- **Swagger Documentation** - Interactive API documentation
- **OpenAPI 3.0 Spec** - Standard-compliant API specification
- **SDK Generation** - Auto-generate client libraries
- **TypeScript Support** - Full type safety and IntelliSense
- **Comprehensive Logging** - Winston-based logging system

### 🗄️ **Database & Performance**
- **PostgreSQL Database** - Robust, ACID-compliant storage
- **Drizzle ORM** - Type-safe database operations
- **Automated Migrations** - Database schema management
- **Connection Pooling** - Optimized database performance

---

## 🛠️ Tech Stack

| Category | Technology | Version | Purpose |
|----------|------------|---------|---------|
| **Runtime** | Node.js | 18+ | JavaScript runtime |
| **Framework** | Express.js | 4.21+ | Web application framework |
| **Language** | TypeScript | 5.3+ | Type-safe JavaScript |
| **Database** | PostgreSQL | 13+ | Primary database |
| **ORM** | Drizzle | 0.36+ | Database operations |
| **Validation** | Zod | 3.23+ | Schema validation |
| **Documentation** | Swagger | 3.0+ | API documentation |
| **Authentication** | JWT | 9.0+ | Token-based auth |
| **Logging** | Winston | 3.15+ | Application logging |
| **Build Tool** | Webpack | 5.89+ | Module bundling |

---

## ⚡ Getting Started

### 📋 Prerequisites
- **Node.js** 18+ 
- **PostgreSQL** 13+
- **pnpm** (recommended) or npm
- **Git**

### 🚀 Quick Start

#### 1. **Clone the Repository**
```bash
git clone https://github.com/yourusername/civic-sphere-api.git
cd civic-sphere-api
```

#### 2. **Install Dependencies**
```bash
pnpm install
# or
npm install
```

#### 3. **Environment Setup**
```bash
cp env.sample .env
```

Configure your `.env` file:
```env
# Server Configuration
PORT=3001

# Database Configuration
PG_USER=postgres
PG_HOST=localhost
PG_DATABASE=civic_sphere
PG_PASSWORD=your_password
PG_PORT=5432
PG_SSL=false

# JWT Configuration
JWT_SECRET=your-super-secret-key-here
JWT_EXPIRY=1h

# Email Configuration (Optional)
EMAIL=your-email@domain.com
EMAIL_PASS=your-email-password
```

#### 4. **Database Setup**
```bash
# Start PostgreSQL (if using Docker)
docker-compose up -d postgres

# Run migrations
pnpm run migrate:generate
```

#### 5. **Start Development Server**
```bash
pnpm run devStart
# or
npm run devStart
```

### 🎉 **Success Indicators**

When the server starts successfully, you'll see:

```bash
Starting server..
2025-08-16 13:36:28 [info]: Migration completed successfully 
2025-08-16 13:36:28 [info]: Super admin already exists 
2025-08-16 13:36:28 [info]: 🚀 Server is running! 
2025-08-16 13:36:28 [info]: 🔗 API Base URL: http://localhost:3001 
2025-08-16 13:36:28 [info]: 📝 API Documentation: http://localhost:3001/docs 
2025-08-16 13:36:28 [info]: 📦 OpenAPI Spec: http://localhost:3001/docs-json 
```

---

## 📚 API Documentation

### 🌐 **Enhanced Swagger UI**
Access our beautifully styled, interactive API documentation at:
- **Local Development**: `http://localhost:3001/docs`
- **Development Environment**: `https://deepak-test.sample.com/docs`
- **Production Environment**: `https://dk404.sample.com/docs`

✨ **Features:**
- **🎨 Custom Styling** - Modern, portfolio-worthy design
- **🔍 Enhanced Readability** - Larger fonts and better spacing
- **📱 Responsive Design** - Works perfectly on all devices
- **🎯 Interactive Testing** - Try endpoints directly from the docs
- **🏷️ Organized Tags** - Logical grouping with emojis for easy navigation
- **📊 Rich Descriptions** - Comprehensive endpoint documentation

### 📄 **OpenAPI Specification**
Get the raw OpenAPI 3.0 spec at:
- **Local Development**: `http://localhost:3001/docs-json`
- **Development Environment**: `https://deepak-test.sample.com/docs-json`
- **Production Environment**: `https://dk404.sample.com/docs-json`

### 🔌 **Core Endpoints**

#### **Authentication**
- `POST /auth/generate-otp` - Generate OTP for login
- `POST /auth/verify-otp` - Verify OTP and authenticate
- `POST /auth/refresh-token` - Refresh JWT tokens

#### **Users**
- `GET /users` - List users (admin/super admin only)
- `POST /users` - Create new user
- `PUT /users/:id` - Update user
- `DELETE /users/:id` - Delete user

#### **Departments**
- `GET /departments` - List departments
- `POST /departments` - Create department
- `PUT /departments/:id` - Update department
- `DELETE /departments/:id` - Delete department

#### **Dashboard**
- `GET /dashboard/summary` - Get business summary
- `GET /dashboard/analytics` - Get analytics data

---

## 🏗️ Project Structure

```
civic-sphere-api/
├── 📁 src/
│   ├── 📁 controllers/     # Business logic handlers
│   ├── 📁 db/             # Database schemas & migrations
│   ├── 📁 helpers/        # Utility functions
│   ├── 📁 routers/        # API route definitions
│   ├── 📁 schema/         # Zod validation schemas
│   ├── 📄 app.ts          # Express app configuration
│   ├── 📄 main.ts         # Server entry point
│   └── 📄 env.ts          # Environment variables
├── 📁 drizzle/            # Database migration files
├── 📁 logs/               # Application logs
├── 📄 package.json        # Dependencies & scripts
├── 📄 docker-compose.yaml # Docker services
├── 📄 Dockerfile          # Container configuration
└── 📄 README.md           # This file
```

---

## 🔧 Development

### 📜 **Available Scripts**
```bash
# Development
pnpm run devStart          # Start dev server with hot reload
pnpm run dev               # Start server in dev mode

# Building
pnpm run build             # Build for production
pnpm run build:dev         # Build for development

# Database
pnpm run migrate:generate  # Generate & run migrations
pnpm run studio            # Open Drizzle Studio

# Documentation
pnpm run generate:docs     # Generate OpenAPI spec

# Code Quality
pnpm run eslint            # Run ESLint
pnpm run format            # Format with Prettier
```

### 🗄️ **Database Operations**
```bash
# Generate new migration
pnpm run migrate:generate

# Open database studio
pnpm run studio
```

---

## 🐳 Docker Deployment

### **Quick Start with Docker Compose**
```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

### **Custom Docker Build**
```bash
# Build image
docker build -t civic-sphere-api .

# Run container
docker run -p 3001:3001 civic-sphere-api
```

---

## 📊 API Response Examples

### **Successful Response**
```json
{
  "message": "Department created successfully",
  "payload": {
    "id": "dept_123",
    "name": "Public Works",
    "city": "Springfield",
    "state": "Illinois",
    "email": "works@springfield.gov"
  }
}
```

### **Error Response**
```json
{
  "name": "ValidationError",
  "message": "Invalid input data",
  "details": [
    "Department name is required",
    "City must be a valid string"
  ]
}
```

---

## 🔒 Security Features

- **JWT Token Authentication** with configurable expiry
- **Role-Based Access Control** (RBAC) implementation
- **Input Validation** using Zod schemas
- **Password Hashing** with bcrypt
- **CORS Protection** configurable per environment
- **Environment Variable** management for sensitive data

---

## 📈 Performance & Scalability

- **Connection Pooling** for database optimization
- **Efficient Queries** with Drizzle ORM
- **Async/Await** patterns for non-blocking operations
- **Modular Architecture** for easy scaling
- **Comprehensive Logging** for monitoring

---

## 🧪 Testing & Quality

- **TypeScript** for compile-time error checking
- **ESLint** for code quality enforcement
- **Prettier** for consistent code formatting
- **Structured Logging** for debugging
- **Input Validation** for data integrity

---

## 🌍 Environment Support

| Environment | URL | Description |
|-------------|-----|-------------|
| **Local** | `http://localhost:3001` | Development environment |
| **Development** | `https://deepak-test.sample.com` | Staging environment |
| **Production** | `https://dk404.sample.com` | Live production environment |

---

## 🤝 Contributing

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'Add amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

---

## 📝 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- **Express.js** team for the amazing web framework
- **Drizzle ORM** for type-safe database operations
- **Swagger** for comprehensive API documentation
- **PostgreSQL** for the robust database system

---

<div align="center">

**Made with ❤️ for better civic management**

[⭐ Star this repo](#) • [🐛 Report issues](#) • [💡 Request features](#)

</div>
