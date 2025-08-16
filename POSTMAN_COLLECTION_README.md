# 🏛️ Civic Sphere API - Postman Collection

A comprehensive Postman collection for the Civic Sphere API with proper documentation, standards, and automated testing scripts.

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Installation & Setup](#installation--setup)
- [Collection Structure](#collection-structure)
- [API Standards](#api-standards)
- [Authentication](#authentication)
- [Usage Instructions](#usage-instructions)
- [Testing & Scripts](#testing--scripts)
- [Environment Variables](#environment-variables)
- [Troubleshooting](#troubleshooting)
- [API Documentation](#api-documentation)

## 🚀 Overview

The Civic Sphere API is a comprehensive Node.js + Express API for managing civic infrastructure including departments, users, and districts with role-based access control and Swagger SDK integration.

This Postman collection provides:
- **Complete API coverage** for all endpoints
- **Automated testing scripts** for response validation
- **Collection variable management** for different deployment stages
- **Comprehensive documentation** for each API endpoint
- **Role-based access control** testing scenarios
- **Error handling** and validation testing

**🌐 Published Collection**: This collection is also available as a [published Postman collection](https://documenter.getpostman.com/view/17055995/2sB3BHkUTB) for easy sharing and collaboration.

### Benefits of Published Collection
- **🔄 Auto-updates**: Always get the latest version
- **👥 Team Collaboration**: Easy sharing with team members
- **📱 Web Access**: View documentation in any browser
- **🚀 Quick Import**: One-click import into Postman
- **📊 Analytics**: Track collection usage and performance

## ✨ Features

- 🔐 **JWT Authentication** with automatic token management
- 👥 **Role-based Access Control** (Super Admin, Admin, User)
- 🏢 **Department Management** with CRUD operations
- 👤 **User Management** with comprehensive user operations
- 📊 **Dashboard Analytics** for business intelligence
- 🔑 **Password Reset** with OTP verification
- 🧪 **Automated Testing** with Postman scripts
- 📝 **Detailed Documentation** for each endpoint
- 🌍 **Multi-environment Support** (Local, Dev, Production)

## 🛠️ Installation & Setup

### Prerequisites
- [Postman](https://www.postman.com/downloads/) (Desktop or Web)
- Civic Sphere API server running
- Valid user credentials for testing

### Server Configuration
The API runs on port **3001** by default. You can verify this in:
- `src/env.ts`: `PORT: process.env?.PORT ? parseInt(process.env.PORT) : 3001`
- `env.sample`: `PORT=3001`

To change the port, set the `PORT` environment variable before starting the server.

### Import Collection

#### Option 1: Import from Published Collection (Recommended)
1. **Use Published Collection**
   - Click the "Run in Postman" button above
   - Or visit: [Civic Sphere API Collection](https://documenter.getpostman.com/view/17055995/2sB3BHkUTB)
   - Click "Run in Postman" to import directly

#### Option 2: Import from Local File
1. **Download the Collection**
   ```bash
   # The collection file is: Civic-Sphere-API.postman_collection.json
   ```

2. **Import into Postman**
   - Open Postman
   - Click "Import" button
   - Drag & drop the collection file or click "Upload Files"
   - Select the `Civic-Sphere-API.postman_collection.json` file

3. **Verify Import**
   - Collection should appear in the left sidebar
   - All folders and requests should be visible
   - Collection variables should be automatically created

## 📁 Collection Structure

```
🏛️ Civic Sphere API
├── 🔐 Authentication
│   └── Login
├── 👥 User Management
│   ├── Get All Users
│   ├── Get User by ID
│   ├── Add New User
│   ├── Update User
│   └── Delete User
├── 🏢 Department Management
│   ├── Get All Departments
│   ├── Get Department by ID
│   ├── Add New Department
│   ├── Update Department
│   └── Delete Department
├── 📊 Dashboard Analytics
│   └── Get Dashboard Summary
└── 🔑 Password Reset
    ├── Generate OTP
    ├── Verify OTP
    └── Reset Password
```

## 📊 API Standards

### HTTP Methods
- **GET**: Retrieve data (safe, idempotent)
- **POST**: Create new resources or perform actions
- **PUT**: Create or replace resources (idempotent)
- **PATCH**: Partial updates to resources
- **DELETE**: Remove resources (idempotent)

### Response Format
All API responses follow a consistent structure:
```json
{
  "message": "Operation status message",
  "payload": {
    // Response data or object
  }
}
```

### Status Codes
- **200**: Success
- **400**: Bad Request (validation errors)
- **401**: Unauthorized (authentication required)
- **404**: Not Found (resource doesn't exist)
- **500**: Internal Server Error

### Error Handling
```json
{
  "message": "Error description",
  "error": "Error type",
  "details": "Additional error information"
}
```

## 🔐 Authentication

### JWT Token Flow
1. **Login** → Receive JWT token using district name and password
2. **Store token** in environment variable
3. **Include token** in Authorization header for protected endpoints
4. **Token automatically expires** after configured time

### Important Note
**Users are identified by their district, not by email address.** The login API requires:
- `district_name_en`: The district name in English (e.g., "Raipur")
- `pass`: The user's password

### Authorization Header
```
Authorization: Bearer <your-jwt-token>
```

### Role-based Access
- **Super Admin**: Full access to all departments and users
- **Admin**: Manage their own department and users within it
- **User**: Limited access to their own information

## 📖 Usage Instructions

### 1. Initial Setup
1. Import the collection into Postman
2. Set up environment variables (see Environment Variables section)
3. Update the `baseUrl` variable to match your server
   - **Default Local**: `http://localhost:3001`
   - **Custom Port**: Change if you've configured a different port
   - **Environment**: Update for dev/staging/production servers

### 2. Authentication Flow
1. **Login Request**: Use the Login endpoint with your district name and password
2. **Token Storage**: JWT token is automatically stored in `authToken` variable
3. **Protected Requests**: All subsequent requests automatically use the stored token

### 3. Testing Workflow
1. **Start with Authentication**: Always begin with the Login request
2. **Verify Token Storage**: Check console for "JWT token stored successfully" message
3. **Test CRUD Operations**: Use the provided test data and variables
4. **Validate Responses**: Check the test results in the Postman console
5. **Error Testing**: Test with invalid data to verify error handling

### 4. Step-by-Step Testing
1. **Run Login Request**: Use your district name and password
2. **Check Console**: Look for successful token storage message
3. **Verify Collection Variables**: Check if `authToken` is populated
4. **Test Protected Endpoint**: Try "Get All Users" or similar
5. **Check Authorization Header**: Ensure "Bearer <token>" is sent

### 4. Environment Switching
- **Local Development**: `http://localhost:3001`
- **Development**: Update `baseUrl` to your dev server
- **Production**: Update `baseUrl` to your production server

## 🧪 Testing & Scripts

### Pre-request Scripts
- **Common Setup**: Logs request details and validates environment
- **Token Validation**: Checks for valid authentication tokens
- **Environment Checks**: Warns about missing required variables

### Test Scripts
- **Response Validation**: Verifies status codes and response structure
- **Data Integrity**: Checks required fields and data types
- **Performance Testing**: Validates response times
- **Error Handling**: Tests error scenarios and messages

### Automated Workflows
- **Token Management**: Automatically stores and uses JWT tokens
- **Request Chaining**: Links related requests (e.g., OTP generation → verification)
- **Data Persistence**: Stores response data for subsequent requests

## 🌍 Environment Variables

### Required Variables
```json
{
  "baseUrl": "http://localhost:3001",
  "districtNameEn": "Raipur",
  "password": "password123"
}
```

### Optional Variables
```json
{
  "userId": "123e4567-e89b-12d3-a456-426614174000",
  "departmentId": "123e4567-e89b-12d3-a456-426614174000",
  "districtId": "123",
  "districtNameEn": "Raipur",
  "districtNameHi": "रायपुर"
}
```

### Auto-managed Variables
```json
{
  "authToken": "", // Automatically set after login
  "resetRequestId": "" // Automatically set during password reset
}
```

## 🔧 Troubleshooting

### Common Issues

#### 1. Authentication Errors
**Problem**: 401 Unauthorized responses
**Solution**: 
- Verify login credentials
- Check if JWT token is valid
- Ensure token is stored in `authToken` variable

#### 2. Environment Variable Issues
**Problem**: Variables not resolving
**Solution**:
- Check environment selection in Postman
- Verify variable names match exactly
- Ensure variables are properly set

#### 3. CORS Issues
**Problem**: Cross-origin request blocked
**Solution**:
- Verify server CORS configuration
- Check if using correct base URL
- Ensure server is accessible

#### 4. Test Failures
**Problem**: Tests not passing
**Solution**:
- Check response structure matches expectations
- Verify API endpoint is working
- Review test script logic

### Debug Mode
Enable detailed logging in Postman:
1. Open Postman Console (View → Show Postman Console)
2. Check request/response details
3. Review test script execution logs

### Token Troubleshooting
If you're getting "JsonWebTokenError" after login:
1. **Check Console**: Look for "JWT token stored successfully" message
2. **Verify Token**: Check if token is stored in collection variables
3. **Test Sequence**: Always run Login first, then other APIs
4. **Token Format**: Ensure token starts with "eyJ" (JWT format)
5. **Variable Scope**: Token is stored in collection variables, not environment

## 📚 **Postman Documentation**

The API documentation is available in the Postman collection below:

[![Run in Postman](https://run.pstmn.io/button.svg)](https://documenter.getpostman.com/view/17055995/2sB3BHkUTB)

**📖 Published Collection**: [Civic Sphere API Collection](https://documenter.getpostman.com/view/17055995/2sB3BHkUTB)

### Swagger Integration
- **Swagger UI**: Available at `/api-docs` endpoint
- **OpenAPI Spec**: Available at `/api-json` endpoint
- **Interactive Testing**: Test APIs directly in Swagger UI

### Endpoint Categories

#### Authentication
- **POST /login**: User authentication using district name and password, returns JWT token

#### User Management
- **GET /users**: Retrieve paginated user list with filtering
- **GET /users/{uid}**: Get specific user details
- **PUT /users/add**: Create new user account
- **PATCH /users/{uid}**: Update existing user
- **DELETE /users/{uid}**: Remove user account

#### Department Management
- **GET /departments**: Retrieve paginated department list
- **GET /departments/{id}**: Get specific department details
- **PUT /departments/add**: Create new department
- **PATCH /departments/{id}**: Update existing department
- **DELETE /departments/{id}**: Remove department

#### Dashboard Analytics
- **GET /dashboard/summary**: Get system overview statistics

#### Password Reset
- **POST /resetPassword/generateOtp**: Generate OTP for password reset
- **POST /resetPassword/verifyOtp**: Verify OTP code
- **POST /resetPassword**: Set new password after verification

## 🤝 Contributing

### Adding New Endpoints
1. **Create Request**: Add new request to appropriate folder
2. **Add Tests**: Include comprehensive test scripts
3. **Update Documentation**: Add detailed description and examples
4. **Test Thoroughly**: Verify all scenarios work correctly

### Updating Existing Endpoints
1. **Modify Request**: Update URL, headers, or body as needed
2. **Update Tests**: Modify test scripts for new requirements
3. **Update Documentation**: Reflect any changes in behavior
4. **Version Control**: Document changes in collection version

## 📄 License

This Postman collection is part of the Civic Sphere API project and follows the same licensing terms.

## 🆘 Support

### Getting Help
- **Documentation**: Check this README and API documentation
- **Issues**: Report problems in the project repository
- **Community**: Engage with the development team

### Resources
- [Postman Learning Center](https://learning.postman.com/)
- [Postman Scripts Reference](https://learning.postman.com/docs/writing-scripts/script-references/)
- [Civic Sphere API Documentation](https://github.com/yourusername/civic-sphere-api)

### 📚 Collection Documentation
- **Published Collection**: [Civic Sphere API - Postman Collection](https://documenter.getpostman.com/view/17055995/2sB3BHkUTB)
- **Local Collection**: `Civic-Sphere-API.postman_collection.json`
- **API Documentation**: Available at `/docs` endpoint when server is running

---

**Happy Testing! 🚀**

*This collection is designed to make API testing efficient, reliable, and comprehensive for the Civic Sphere API.*
