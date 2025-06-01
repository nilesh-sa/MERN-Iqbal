
# 🔐 Full-Stack Authentication App (React + Node.js + Prisma)

A complete full-stack authentication system with:

- ✅ Email Verification
- ✅ User Account Activation
- ✅ JWT-based Authentication
- ✅ TypeScript Support (Frontend & Backend)

---

## 📁 Project Structure

```

.
├── client/         # React + TypeScript (Frontend)
└── server/         # Express + Prisma + MySQL (Backend)

````

---

## ⚙️ Prerequisites

- Node.js (v18+)
- npm or yarn
- MySQL (e.g., XAMPP or standalone)
- SMTP credentials (Gmail, Mailtrap, etc.)

---

## 🛠 Setup Instructions

### 🔧 1. Backend Setup (`/server`)

#### 📥 Install Dependencies

```bash
cd server
npm install
````

#### ⚙️ Environment Variables

Create a `.env` file:

```env
DATABASE_URL="mysql://USER:PASSWORD@localhost:3306/DATABASE_NAME"
JWT_SECRET="your_jwt_secret"
EMAIL_USER="your_email@example.com"
EMAIL_PASS="your_email_app_password"
EMAIL_HOST="smtp.example.com"
EMAIL_PORT=465
FRONTEND_URL=http://localhost:8080
PORT=5000
```

#### 🗃️ Initialize Prisma & DB

```bash
npx prisma generate
npx prisma migrate dev --name init
```

#### 🌱 Optional: Seed Demo User

```bash
npm run seed
```

#### ▶️ Run Server

```bash
npm run dev
```

> ✅ Server runs on `http://localhost:5000`

---

### 🌐 2. Frontend Setup (`/client`)

#### 📥 Install Dependencies

```bash
cd client
npm install
```

#### ⚙️ Environment Variables

Create `.env`:

```env
VITE_API_BASE_URL=http://localhost:5000
```

#### ▶️ Run Frontend

```bash
npm run dev
```

> ✅ Frontend runs on `http://localhost:8080`

---

## ✉️ Email Verification Flow

1. User registers or a demo user is seeded.
2. An email is sent with a verification link:

   ```
   http://localhost:8080/verify?token=<JWT_TOKEN>
   ```
3. The user clicks the link:

   * ✅ Account gets verified
   * ⚠️ Token expired or invalid → shows error

---

## ✅ Features

* JWT-based token system
* Nodemailer integration for email delivery
* Prisma ORM with MySQL
* Token expiration and cleanup
* React status UI (loading/success/error)
* API error handling and toasts

---

## 🚨 Troubleshooting

| Issue             | Solution                                                            |
| ----------------- | ------------------------------------------------------------------- |
| DB not connecting | Check `DATABASE_URL` in `.env` and MySQL status                     |
| No email sent     | Check SMTP config (`EMAIL_*`) or use Mailtrap                       |
| Token expired     | Ensure token has not passed expiration (`emailVerificationExpires`) |
| CORS issues       | Add correct `origin` in backend middleware                          |
| Prisma error      | Run `npx prisma generate` again                                     |

---

## 🔐 Sample API Endpoints

| Method | Endpoint               | Description                 |
| ------ | ---------------------- | --------------------------- |
| POST   | `/auth/register`       | Register user + email token |
| POST   | `/auth/verifyAccount` | Verify email with token     |
| POST   | `/auth/login`          | User login (JWT)            |

---

## 🧪 Test Flow

* Register → check mail → click link
* Backend updates user:

  * `isVerified = true`
  * `emailVerificationToken = null`
* Token expires after configured time (default: 1h)

---

## 📦 Build for Production

### Frontend

```bash
npm run build
npm start 
```


