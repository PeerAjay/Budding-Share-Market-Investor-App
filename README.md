# COSC2408 Budding Share Market Investor App 
COSC2408 Semester 1 2026 | VS666 | Budding Share Market Investor App 

## About 
A simulated share market investment app where users can create trading accounts, buy and sell stocks using live market data, track their portfolio performance, and compete on a leaderboard.

## Members
- Ajay Peeris: S4088958@student.rmit.edu.au
- Devon Katsuk: S3844510@student.rmit.edu.au
- Ninh Duy Huynh: S4003174@student.rmit.edu.au
- Theresa Ngo: S3854837@student.rmit.edu.au
- Zhoutong Chen: S4007490@student.rmit.edu.au

## Tech Stack
### Frontend 
- React (Vite)
### Backend
- Spring Boot
- Database: PostgreSQL
- Stock price data: [EODHD API](https://eodhd.com)

## Installation

### Prerequisites
- [Node.js](https://nodejs.org/en/download) (npm is included)
- [Java 17+](https://adoptium.net/)
- [Maven](https://maven.apache.org/install.html)
- [PostgreSQL](https://www.postgresql.org/download/)

### 1. Database Setup (PostgreSQL)

**Install PostgreSQL**

macOS (Homebrew):
```
brew install postgresql
brew services start postgresql
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

**Set up environment variables**

The backend requires an [EODHD](https://eodhd.com) API key for live stock prices. Get a free API key from their website, then set it in your terminal before starting the backend.

macOS:
```
export EODHD_API_KEY=your_api_key_here
```

Windows (Command Prompt):
```
set EODHD_API_KEY=your_api_key_here
```

Windows (PowerShell):
```
$env:EODHD_API_KEY="your_api_key_here"
```

> This must be set every time you open a new terminal. To avoid this, add it to your shell profile (`~/.zshrc` on macOS) or Windows environment variables in System Settings.

**Start the backend**
```
cd backend
mvn spring-boot:run
```
Runs on `http://localhost:8080`.

**Stock price updates**

Stock prices are fetched from EODHD and saved to the database on a scheduled cron job (default: 2:55 AM Sydney time, after US market close). To trigger a manual update:
```
curl -X POST http://localhost:8080/api/stocks/refresh
```

To change the schedule, edit `stock-price-update.cron` in `backend/src/main/resources/application.properties`. Format: `second minute hour * * *` (24-hour, Sydney time).

### 3. Frontend
```
cd frontend
npm install
npm run dev
```
Open the localhost link shown in the terminal.

## Live Demo

The app is deployed and accessible at:

**Frontend:** https://budding-share-investor.up.railway.app

**Default admin credentials:** `admin@example.com` / `admin123`

**Default user credentials:** `john@example.com` / `password123`

### Loading stock data on the live app

Stock prices are updated automatically daily at 2:55 AM Sydney time. To load stocks immediately (e.g. for assessment), any logged-in user can click **Refresh Stocks** on the stock market dashboard, or run:

```bash
# 1. Get a token
curl -X POST "https://cosc2408-budding-share-market-investor-app-production.up.railway.app/api/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email": "john@example.com", "password": "password123"}'

# 2. Refresh stocks (replace <token> with the token from step 1)
curl -X POST "https://cosc2408-budding-share-market-investor-app-production.up.railway.app/api/stocks/refresh" \
  -H "Authorization: Bearer <token>"
```

## Folder Structure 

```
backend/
├── pom.xml
└── src/main/java/com/shareapp/
    ├── config/                              # Setup and security
    ├── controller/                          # REST endpoints
    │   ├── AuthController.java
    │   ├── DashboardController.java
    │   ├── LeaderboardController.java
    │   ├── PortfolioController.java
    │   ├── StocksController.java
    │   ├── TransactionController.java
    │   └── UserController.java
    ├── DataTransferObjects/                 # Request/response DTOs
    ├── model/                               # Database entities
    │   ├── Holding.java
    │   ├── Stock.java
    │   ├── StockPriceHistory.java
    │   ├── TradingAccount.java
    │   ├── Transaction.java
    │   └── User.java
    ├── repository/                          # Database queries
    ├── security/                            # JWT auth
    ├── service/                             # Business logic
    │   ├── EodhdService.java
    │   ├── LeaderboardService.java
    │   ├── PortfolioService.java
    │   ├── TransactionService.java
    │   └── UserService.java
    └── BuddingShareMarketApplication.java

frontend/
├── public/
├── src/
│   ├── components/
│   │   └── NavigationBar.jsx
│   ├── pages/
│   │   ├── Dashboard.jsx
│   │   ├── Home.jsx
│   │   ├── Leaderboard.jsx
│   │   ├── Login.jsx
│   │   ├── Market.jsx
│   │   ├── Portfolio.jsx
│   │   ├── Profile.jsx
│   │   ├── Registration.jsx
│   │   └── Transactions.jsx
│   ├── services/
│   │   ├── api.js
│   │   └── AuthContext.jsx
│   └── App.jsx
└── package.json
```

## ERD Diagram
<img width="787" height="703" alt="image" src="https://github.com/user-attachments/assets/ff4a3b92-00cd-416f-8feb-95639e5fee1f" />
