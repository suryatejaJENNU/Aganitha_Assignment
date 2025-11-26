📘 TinyLink — URL Shortener with Real-Time Stats

A production-ready, fully responsive URL shortener built with React, Tailwind, Node.js, Express, Neon Postgres, and Socket.IO.
Supports URL shortening, custom codes, redirects, analytics, deletion, and system health checks — following the exact assignment specification.

🚀 Live Demo
🔹 Frontend (Netlify)

👉 https://suryateja-aganitha-assignment.netlify.app/

🔹 Backend (Render)

👉 https://aganitha-assignment.onrender.com

📽️ Video Walkthrough

(https://drive.google.com/file/d/1yud1KShtyim_fXrz2EWuHGPxukS3xv4R/view?usp=sharing)
➡️ Video explanation link here




🎯 Features
🔗 URL Shortening

Create shortened URLs

Optional custom code (6–8 alphanumeric)

Validate URLs before saving

Prevent duplicate custom codes

🔁 Redirection

/:code → 302 redirect to the original URL

Each visit increments:

total_clicks

last_clicked_at

📊 Dashboard

View all shortened links

Target URL

Click count

Last clicked time

Search/filter by code or URL

Delete links

Scrollable table with fixed height

Real-time update when click count changes

🧾 Stats Page /code/:code

Shows:

Short URL

Target URL

Total clicks

Created at

Last clicked (formatted: Just now, 5 min ago, 2 hours ago, 3 days ago, fallback to date)

Copy short URL button

Real-time updates via Socket.IO

❤️ Health Page /health

Displays system uptime

API health status

Version info

⚡ Real-Time Updates

When anyone visits a short URL, Dashboard + StatsPage update instantly.

Implemented using Socket.IO without polling.

🛠️ Tech Stack
Frontend

React (Vite)

React Router DOM

Tailwind CSS

Socket.IO Client

Netlify Hosting

Backend

Node.js

Express.js

Socket.IO

Neon Postgres (serverless)

pg (Database driver)

Render hosting

📁 Project Structure
Backend (/backend)
backend/
│
├── src/
│   ├── routes/
│   │   ├── health.js
│   │   ├── links.js
│   │   └── redirect.js
│   │
│   ├── utils/
│   │   ├── generateCode.js
│   │   └── validate.js
│   │
│   ├── db.js
│   └── index.js
│
├── .env
├── .env.example
├── package.json
├── package-lock.json
└── .gitignore

Frontend (/frontend)
frontend/
│
├── public/
│   └── _redirects
│
├── src/
│   ├── api.js
│   ├── App.jsx
│   ├── main.jsx
│   ├── components/
│   │   ├── Header.jsx
│   │   ├── Layout.jsx
│   │   ├── LinkForm.jsx
│   │   ├── LinksTable.jsx
│   │   ├── LoadingSpinner.jsx
│   │   ├── NotificationProvider.jsx
│   │   └── EmptyState.jsx
│   │
│   ├── pages/
│   │   ├── Dashboard.jsx
│   │   ├── HealthPage.jsx
│   │   └── StatsPage.jsx
│   │
│   └── assets/
│
├── package.json
└── vite.config.js

⚙️ Environment Setup
Backend .env
PORT=4000
DATABASE_URL=postgresql://<neon-connection-string>
BASE_URL=http://localhost:4000

Frontend .env
VITE_API_BASE_URL=https://aganitha-assignment.onrender.com

📡 API Documentation
Base URL
https://aganitha-assignment.onrender.com

📌 Create Short Link

POST /api/links

Request:
{
  "url": "https://example.com",
  "code": "custom12"
}

Responses:

201 → Created

409 → Code exists

400 → Invalid URL

📌 List All Links

GET /api/links

Returns:

[
  {
    "code": "aBc123",
    "target_url": "https://example.com",
    "total_clicks": 10,
    "last_clicked_at": "2025-01-01T12:00:00Z"
  }
]

📌 Get Stats

GET /api/links/:code

📌 Delete Link

DELETE /api/links/:code

📌 Redirect

GET /:code

Redirects to original URL

Increases click count

📌 Health Check

GET /healthz

⚡ Real-Time System (Socket.IO)
Backend emits:
io.emit("click_updated", { code });

Frontend listens:
socket.on("click_updated", (data) => {
   if (data.code === code) {
      loadStats();
   }
});

💻 Running Locally
Backend
cd backend
npm install
npm run dev

Frontend
cd frontend
npm install
npm run dev

🌐 Deployment Instructions
Netlify (Frontend)
Add _redirects file:

public/_redirects

/* /index.html 200

Render (Backend)

Build command: npm install

Start command: npm start

Add environment variables

Link Neon database

🖼️ Screenshots (optional)
![Dashboard](screenshots/dashboard.png)
![Stats](screenshots/stats.png)
![Health](screenshots/health.png)

👤 Author

Jennu Suryateja
full stack developer