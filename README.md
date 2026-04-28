# COSC2408 Budding Share Market Investor App 
COSC2408 Semester 1 2026 | VS666 | Budding Share Market Investor App 

## About 
- To do!

## Members
- Ajay Peeris: S4088958@student.rmit.edu.au
- Devon Katsuk: S3844510@student.rmit.edu.au
- Ninh Duy Huynh: S4003174@student.rmit.edu.au
- Theresa Ngo: S3854837@student.rmit.edu.au
- Zhoutong Chen: S4007490@student.rmit.edu.au

## Tech Stack
### Frontend 
- React 
### Backend
- SpringBoot
- Database: PostgreSQL

## Installation

### Prerequisites
- [Node.js](https://nodejs.org/en/download) (npm is included)
- [Java 17+](https://adoptium.net/)
- [Maven](https://maven.apache.org/install.html)
- [PostgreSQL 18](https://www.postgresql.org/download/)

### 1. Database Setup (PostgreSQL)

**Install PostgreSQL 18**

macOS (Homebrew):
```
brew install postgresql@18
brew services start postgresql@18
```

Windows:
- Download and run the installer from https://www.postgresql.org/download/windows/
- During installation, set the superuser password when prompted
- PostgreSQL will start automatically as a Windows service

**Create the database and user**

macOS — open a terminal:
```
psql postgres
```

Windows — open **SQL Shell (psql)** from the Start Menu and press Enter through the prompts until asked for a password, then enter the password you set during installation. Then run:

```sql
CREATE USER admin WITH PASSWORD 'test123' SUPERUSER CREATEDB;
CREATE DATABASE budding_share_db OWNER admin;
\q
```

The tables are created automatically when the backend starts for the first time.

**Create the default admin account**

After starting the backend, run this in a new terminal:
```
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","email":"admin@shareapp.com","password":"Admin123!","confirmPassword":"Admin123!"}'
```

Then connect to the database and promote to admin:
```
psql -U admin -d budding_share_db
```
```sql
UPDATE users SET role = 'ROLE_ADMIN' WHERE email = 'admin@shareapp.com';
\q
```

Default admin credentials — `admin@shareapp.com` / `Admin123!`

### 2. Backend
```
cd backend
mvn spring-boot:run
```
Runs on `http://localhost:8080`.

### 3. Frontend
```
cd frontend
npm install
npm run dev
```
Open the localhost link shown in the terminal.

## Folder Structure 

```
backend/
├── pom.xml
├── src/main/java/com/shareapp/
│   ├── config/                              # Setup and security
│   ├── controller/                          # Endpoints
│   ├── data/                                # Requests and responses
│   ├── model/                               # Database tables
│   ├── repository/                          # Database queries
│   ├── service/                             # Business logic
│   └── BuddingShareMarketApplication.java
└── src/main/resources/
    └── application.properties

frontend/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   └── NavigationBar.js
│   ├── pages/
│   │   ├── Dashboard.js
│   │   ├── Login.js
│   │   └── Registration.js
│   ├── services/
│   │   ├── api.js
│   │   └── AuthContext.js
│   ├── App.js
│   ├── index.css
│   └── index.js
└── package.json
```

## ERD Diagram
<img width="787" height="703" alt="image" src="https://github.com/user-attachments/assets/ff4a3b92-00cd-416f-8feb-95639e5fee1f" />

