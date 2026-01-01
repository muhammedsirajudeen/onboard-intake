# Admin Panel

## Access

**URL**: `/admin/login`  
**Password**: `@Sirajudeen1`

## Features

### Authentication
- Password-protected access
- Session-based authentication (24-hour duration)
- Secure logout functionality

### Dashboard (`/admin`)
- **User List**: View all students who have signed up
- **Pagination**: 10 users per page
- **Search**: Filter by name or email
- **Statistics**: 
  - Total students
  - Videos recorded
  - Profiles completed

### User Information Displayed
- Name and email
- Profile picture
- Profile completion status
- Video recording status
- Social media links (GitHub, LinkedIn, Twitter, Website, etc.)
- Video recordings with inline player

### Video Player
- Click "Watch Video" to view student submissions
- Modal player with controls
- Direct S3 video streaming

## Setup

### 1. Add Password to Environment

Add to `.env`:
```env
ADMIN_PASSWORD=@Sirajudeen1
```

### 2. Access the Panel

1. Navigate to `/admin/login`
2. Enter password: `@Sirajudeen1`
3. Click "Access Admin Panel"

## API Endpoints

### Authentication
- `POST /api/admin/auth` - Login with password
- `POST /api/admin/logout` - Logout

### Data
- `GET /api/admin/users` - Fetch users with pagination
  - Query params: `page`, `limit`, `search`

## Security

- Password stored in environment variable
- HTTP-only session cookies
- Protected routes (redirect to login if not authenticated)
- 24-hour session duration

## Usage

### Search Users
Type name or email in the search bar and click "Search"

### View Videos
Click the "▶ Watch Video" button on any user card

### Navigate Pages
Use "Previous" and "Next" buttons at the bottom

### Logout
Click "Logout" button in the top-right corner
