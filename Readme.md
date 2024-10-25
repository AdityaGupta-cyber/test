# Dog Picture Management API

An API service for managing dog pictures with user authentication, uploading dog imgae, and CRUD operations. Built with Node.js, Express, and PostgreSQL. It incorporates authentication using username and password , and authorization to make sure only authorized user who uploaded the pic can delete it.

## Features

- User authentication (signup, login, logout).
- JWT-based authorization.
- Image upload and management.
- CRUD operations for dog pictures.
- Image compression and optimization.
- Error handling and validation.

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- PostgreSQL database
- Prisma CLI (`npm install prisma --save-dev`)
- Multer (for file uploads)

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd <project-folder>
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   
   Create a `.env` file in the project root:
   ```env
   DATABASE_URL="postgresql://<user>:<password>@localhost:5432/<database>?schema=public"
   JWT_SECRET="your-secret-key"
   ```

4. **Initialize database**
   ```bash
   npx prisma generate
   npx prisma migrate dev --name init
   ```

5. **Create uploads directory**
   ```bash
   mkdir uploads
   ```

6. **Start the server**
   ```bash
   npm start
   ```

## API Endpoints
### Authentication

#### POST /signup
Register a new user
```json
{
  "username": "testuser",
  "password": "password123"
}
```

#### POST /login
Login with existing credentials
```json
{
  "username": "testuser",
  "password": "password123"
}
```

#### POST /logout
Logs out current user

### Dog Pictures

#### GET /list
Returns list of all dog pictures

#### GET /singleList/:id
Returns details of a specific picture

#### POST /upload
Upload a new dog picture
- Multipart form data
- Fields:
  - `image`: File (JPEG/PNG)
  - `description`: Text (optional)

#### POST /update/:id
Update existing picture
- Multipart form data
- Fields:
  - `image`: File (optional)
  - `description`: Text (optional)

#### POST /delete/:id
Delete a picture

## Error Handling

The API handles various error scenarios:

- 400: Bad Request (validation errors)
- 401: Unauthorized
- 404: Not Found
- 409: Conflict (duplicate username)
- 500: Internal Server Error

## Project Structure

```
├── controllers/
│   ├── authController.js
│   └── pictureController.js
├── middleware/
│   ├── auth.js
│   └── upload.js
├── prisma/
│   └── schema.prisma
├── uploads/
├── views/
├── app.js
└── package.json
```

## Technologies Used

- **Backend**: Node.js, Express.js
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: JWT, bcryptjs
- **File Handling**: Multer, Sharp
- **Validation**: Express-validator


## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Contact

- Email: adityagupta170502@gmail.com
- Phone: +91 7499715142

## License

This project is licensed under the MIT License - see the LICENSE file for details.