﻿# Secure Banking API

## Overview
The **Secure Banking API** is a robust and secure banking system designed to handle various banking operations such as deposits, withdrawals, and transfers. It includes features like user authentication, role-based access control (RBAC), account management, tax calculation based on account levels, and PIN-based transaction security. The API is built using **Node.js**, **Express.js**, **Sequelize ORM**, and **MySQL** for the database.

## Features
- **User Authentication & JWT:** Secure login and registration with JWT for authentication.
- **Role-Based Access Control (RBAC):** Different access levels for Admin, Customer, and Writer.
- **Multi-Account Management:** Each user can own up to 5 bank accounts with unique PINs.
- **Secure Transactions:** Verifies PIN for deposit, withdrawal, and transfer operations.
- **Tax Calculation:** Taxes are deducted from transfers based on the account level (Blue, Silver, Gold, Platinum).
- **Admin Account for Tax:** All transfer taxes are deposited into a specified admin account.
- **Max Balance Per Level:** Account levels have maximum balance limits to prevent exceeding the threshold.

## Getting Started

### 1. Clone the Repository
```bash
git clone https://github.com/username/secure-banking-api.git
cd secure-banking-api
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Setup Environment Variables
Create a .env file in the root directory with the following:
```bash
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=yourpassword
DB_NAME=banking_db
JWT_SECRET=yourjwtsecret
ADMIN_ACCOUNT_NUMBER=1228252816
PORT=3000
```

### 4. Setup Database
Create a new MySQL database:
```sql
CREATE DATABASE banking_db;
```

Run Sequelize migrations to create the necessary tables:
```bash
npx sequelize-cli db:migrate
```

### 5. Run the Server
```bash
npm start
```
The API will be running on http://localhost:3000.

## API Endpoints

### Authentication
- **POST /api/auth/register** – Register a new user
  ```json
  {
  "username": "newuser",
  "email": "newuser@example.com",
  "password": "userpassword",
  "firstName": "John",
  "lastName": "Doe",
  "dateOfBirth": "1990-01-01",
  "address": "123 Main St"
  }
  ```

- **POST /api/auth/login** – Login and receive JWT token
  ```json
  {
    "email": "newuser@example.com",
    "password": "userpassword"
  }
  ```

### Transactions
- **POST /api/transactions/deposit** – Deposit funds to a bank account (with PIN)
```json
  {
    "accountNumber": "1234567890",
    "amount": 500,
    "pin": "userpin"
  }
```

- **POST /api/transactions/withdraw** – Withdraw funds from a bank account (with PIN)
  ```json
  {
    "accountNumber": "1234567890",
    "amount": 200,
    "pin": "userpin"
  }
  ```

- **POST /api/transactions/transfer** – Transfer funds between accounts (with PIN & tax deduction)
  ```json
  {
    "senderAccountNumber": "1234567890",
    "recipientAccountNumber": "0987654321",
    "amount": 100,
    "pin": "userpin"
  }

  ```

### User Management
- **GET /api/user** – Get the details of the logged-in user (requires JWT token)
- **GET /api/account/accounts** – View all accounts for the logged-in user

## Future Enhancements
- **Event & Logs Tracking:** Real-time monitoring of events and logs.
- **Forgot & Reset Password:** Password recovery and reset features.
- **Rate Limiting:** Prevent DDoS attacks by limiting requests.
- **File Management & Notifications:** Possible future implementation.

## Technologies
- **Node.js** and **Express.js**
- **Sequelize ORM** with **MySQL**
- **JWT** for secure authentication
- **bcryptjs** for PIN and password hashing

## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## License
This project is licensed under the MIT License.

