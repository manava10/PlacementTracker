# Placement Backend

Backend for AI-Powered Placement Management System built with Node.js, Express, and MongoDB.

## Features

- ✅ Multi-role authentication (Student, Company, TPO, Admin)
- ✅ JWT-based authorization
- ✅ Role-based access control
- ✅ RESTful API endpoints
- ✅ MongoDB database integration
- ✅ CORS enabled for frontend communication

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT (jsonwebtoken)
- **Password Hashing**: bcryptjs
- **Environment**: dotenv

## Installation

### 1. Prerequisites
- Node.js (v14 or higher)
- MongoDB (running locally or Atlas connection string)
- npm or yarn

### 2. Setup

```bash
# Navigate to backend directory
cd placement-backend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Edit .env with your configuration
```

### 3. Configure Environment Variables

Edit `.env` file:

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/placement-db
JWT_SECRET=your_secret_key_here_change_in_production
JWT_EXPIRE=7d
CLIENT_URL=http://localhost:5173
```

### 4. Start MongoDB

```bash
# If using local MongoDB
mongod

# Or use MongoDB Atlas connection string in .env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/placement-db
```

### 5. Run the Server

```bash
# Development mode (with auto-reload)
npm run dev

# Production mode
npm start
```

Server will start at `http://localhost:5000`

## Project Structure

```
placement-backend/
├── src/
│   ├── server.js              # Main server file
│   ├── config/
│   │   └── db.js              # Database connection
│   ├── models/
│   │   ├── User.js            # User schema
│   │   ├── Student.js         # Student profile
│   │   ├── Company.js         # Company profile
│   │   ├── PlacementDrive.js  # Placement drive
│   │   ├── Application.js     # Job application
│   │   └── Interview.js       # Interview schedule
│   ├── controllers/
│   │   ├── authController.js  # Auth logic
│   │   ├── studentController.js
│   │   ├── companyController.js
│   │   ├── tpoController.js
│   │   └── adminController.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── studentRoutes.js
│   │   ├── companyRoutes.js
│   │   ├── tpoRoutes.js
│   │   └── adminRoutes.js
│   └── middleware/
│       ├── auth.js            # JWT & role authorization
│       └── errorHandler.js    # Global error handler
├── package.json
├── .env.example
└── .gitignore
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (protected)

### Student Routes (`/api/student`)
- `GET /dashboard` - Dashboard stats
- `GET /profile` - Student profile
- `PUT /profile` - Update profile
- `GET /drives` - Browse placement drives
- `POST /apply` - Apply for a drive
- `GET /applications` - View applications
- `GET /interviews` - View interviews

### Company Routes (`/api/company`)
- `GET /dashboard` - Dashboard stats
- `POST /drives` - Create placement drive
- `GET /drives` - View company drives
- `GET /applicants` - View all applicants
- `GET /shortlisted` - View shortlisted candidates
- `POST /interviews` - Schedule interview
- `GET /interviews` - View interviews

### TPO Routes (`/api/tpo`)
- `GET /dashboard` - Dashboard overview
- `GET /students` - List all students
- `GET /companies` - List all companies
- `GET /drives` - List all drives
- `GET /reports` - Generate reports

### Admin Routes (`/api/admin`)
- `GET /dashboard` - System dashboard
- `GET /students` - Manage students
- `GET /companies` - Manage companies
- `POST /verify-company` - Verify company
- `GET /drives` - Manage drives
- `GET /interviews` - View all interviews
- `GET /reports` - Generate system reports

## Authentication

All protected routes require JWT token in the Authorization header:

```bash
curl -H "Authorization: Bearer YOUR_TOKEN" http://localhost:5000/api/student/dashboard
```

### Register Example

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123",
    "role": "student",
    "additionalData": {
      "rollNumber": "2021001",
      "department": "CSE",
      "batch": "2021"
    }
  }'
```

### Login Example

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

## Database Models

### User
- name, email, password, role
- profilePicture, phone
- timestamps

### Student
- userId (reference), rollNumber, department, batch
- cgpa, resume, skills, bio
- atsScore, profileStrength
- isPlaced, placedCompany, salary

### Company
- userId (reference), companyName, website, location
- industry, description
- hrName, hrPhone, hrEmail
- logo, isVerified
- totalPositions, filledPositions

### PlacementDrive
- title, description, company
- positions, salary, location, jobRole
- eligibility (minCGPA, departments, batches)
- registrationDeadline, driveDate, status
- requirements, benefits

### Application
- student, placementDrive, company
- status (applied, shortlisted, rejected, selected)
- appliedAt, shortlistedAt, rejectedAt, selectedAt
- salary, ctc

### Interview
- student, company, placementDrive
- round (online, group discussion, technical, hr, final)
- scheduledDate, status
- location, interviewer, interviewerEmail
- feedback, result, joinLink

## Error Handling

The API returns consistent error responses:

```json
{
  "error": "Error message",
  "status": 400
}
```

## Common Status Codes

- `200` - OK
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `500` - Server Error

## Development Tips

1. **Hot Reload**: Changes auto-reload in dev mode
2. **MongoDB**: Use MongoDB Compass to visualize data
3. **Testing**: Use Postman or Thunder Client for API testing
4. **Logs**: Check console for detailed error logs

## Next Steps

1. Connect this backend with the frontend
2. Add input validation (joi or express-validator)
3. Add email notifications
4. Add file upload for resumes
5. Implement ATS scoring API
6. Add comprehensive error logging
7. Write unit tests
8. Deploy to production

## Support

For issues or questions, check the documentation or create an issue in the repository.
