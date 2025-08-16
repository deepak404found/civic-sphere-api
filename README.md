# Civic Sphere API

A comprehensive API backend for civic management systems built with TypeScript, Express, and PostgreSQL.

## 🚀 Features

- **User Management**: Role-based access control with JWT authentication
- **Department Management**: Multi-department support with hierarchical access
- **Dashboard Analytics**: Comprehensive business intelligence and reporting
- **Swagger Integration**: Professional API documentation with customizable themes
- **Database**: PostgreSQL with Drizzle ORM and automated migrations

## 📚 API Documentation

### Swagger UI
- **Local Development**: `http://localhost:3001/docs`
- **Development Environment**: `https://deepak-test.gimbooks.com/docs`
- **Production Environment**: `https://dk404.gimbooks.com/docs`

### OpenAPI JSON
- **Local Development**: `http://localhost:3001/docs-json`
- **Development Environment**: `https://deepak-test.gimbooks.com/docs-json`
- **Production Environment**: `https://dk404.gimbooks.com/docs-json`

## ⚙️ Configuration

### Environment Variables

Copy `env.sample` to `.env` and configure the following:

#### Server Configuration
- `PORT`: Server port (default: 3001)

#### Database Configuration
- `PG_USER`: PostgreSQL username
- `PG_HOST`: PostgreSQL host
- `PG_DATABASE`: Database name
- `PG_PASSWORD`: Database password
- `PG_PORT`: Database port
- `PG_SSL`: Enable SSL connection
- `ENABLE_PG_LOG`: Enable database logging

#### Swagger Configuration
- `SWAGGER_ENABLE`: Enable/disable Swagger documentation (default: true)
- `SWAGGER_THEME`: UI theme (one-dark, monokai, material, nord, outline)
- `SWAGGER_DOCS_PATH`: Documentation path (default: docs)
- `SWAGGER_JSON_PATH`: JSON spec path (default: docs-json)
- `SWAGGER_DEVELOPMENT_URL`: Development server URL
- `SWAGGER_PRODUCTION_URL`: Production server URL

#### Email Configuration
- `EMAIL`: SMTP email address
- `EMAIL_PASS`: SMTP password
- `NODEMAILER_LOGGER`: Enable email logging
- `NODEMAILER_DEBUG`: Enable email debugging

#### JWT Configuration
- `JWT_SECRET`: Secret key for JWT tokens
- `JWT_EXPIRY`: Token expiration time

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd civic-sphere-api
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Configure environment**
   ```bash
   cp env.sample .env
   # Edit .env with your configuration
   ```

4. **Start the server**
   ```bash
   # Development
   pnpm start:dev
   
   # Production
   pnpm start:prod
   ```

## 📖 API Endpoints

### Authentication
- `POST /auth/generate-otp` - Generate OTP for login
- `POST /auth/verify-otp` - Verify OTP and authenticate
- `POST /auth/refresh-token` - Refresh JWT tokens

### Users
- `GET /users` - List users (admin/super admin only)
- `POST /users` - Create new user
- `PUT /users/:id` - Update user
- `DELETE /users/:id` - Delete user

### Departments
- `GET /departments` - List departments
- `POST /departments` - Create department
- `PUT /departments/:id` - Update department
- `DELETE /departments/:id` - Delete department

### Dashboard
- `GET /dashboard/summary` - Get business summary
- `GET /dashboard/analytics` - Get analytics data

## 🔧 Development

### Available Scripts
- `pnpm start:dev` - Start development server with hot reload
- `pnpm start:prod` - Start production server
- `pnpm build` - Build the project
- `pnpm lint` - Run ESLint
- `pnpm format` - Format code with Prettier

### Database Migrations
```bash
pnpm run db:migrate
```

## 🐳 Docker

### Build and run with Docker Compose
```bash
docker-compose up --build
```

## 📝 License

This project is licensed under the MIT License.
