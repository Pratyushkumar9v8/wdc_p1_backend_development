# WDC Backend Development Project

A full-stack authentication system built using Node.js, Express, TypeScript, MySQL (Railway Cloud), and React.

##  Features

### Authentication System:
- Implement secure Signup and Login APIs.
- Requirement: Use secure password hashing (e.g., bcrypt) and strict input validation.

### Database Integration & CRUD:
- Integrate with a MySQL database.
- Implement CRUD operations for a User Profile section (Update name, bio, contact details and Delete account).

### JWT Authentication Flow:
- Implement JWT-based authentication.
- Create an API endpoint that decrypts the token and returns the authenticated user’s details

##  Tech Stack
- Frontend: React, Axios  
- Backend: Express, TypeScript, MySQL2, JWT, bcrypt  
- Database: Railway Hosted MySQL  

##  Security
- Parameterized queries  
- JWT with expiry  
- Rate Limiting
- HttpOnly Cookies

##  Deployment
- Cloud MySQL via Railway  
- SSL-enabled database connection  
- Frontend & Backend hosted on Render