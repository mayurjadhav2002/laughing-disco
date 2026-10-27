# Forecasting analysis

### UK Day-Ahead Wind Energy Trading Desk

Web application for analyzing UK day-ahead wind generation using real-time and historical data from the Elexon BMRS API, powered by a high-performance backend and responsive React frontend.

---

## 🌐 Live URLs

- **Frontend UI (Vercel):** [https://laughing-disco-one.vercel.app/](https://laughing-disco-one.vercel.app/)
- **Backend API (Render):** [https://laughing-disco-5x2b.onrender.com](https://laughing-disco-5x2b.onrender.com)
- **Interactive API Docs (Swagger UI):** [https://laughing-disco-5x2b.onrender.com/docs](https://laughing-disco-5x2b.onrender.com/docs)

---

## 💻 Tech Stack

| Category           | Technologies                                          |
| :----------------- | :---------------------------------------------------- |
| **Backend**        | Python, FastAPI, SQLAlchemy, Pydantic, Uvicorn, Httpx |
| **Frontend**       | React, Vite, TypeScript, Nginx                        |
| **Database**       | SQLite, PostgreSQL                                    |
| **DevOps & Cloud** | Docker, Docker Compose, Render, Vercel                |

---

## 📂 Folder Structure

```text
GridBricks/
├── backend/               # FastAPI backend application
│   ├── src/               # Core business logic, database models, and API routers
│   ├── Dockerfile         # Multi-stage production Dockerfile for Python 3.13
│   └── requirements.txt   # Python pip dependencies
├── frontend/              # Vite / React frontend application
│   ├── src/               # UI components, dashboard views, and API integration
│   ├── Dockerfile         # Multi-stage build (Node 20 builder + Nginx Alpine server)
│   └── package.json       # Node package configuration and dependencies
├── docker-compose.yml     # Local multi-container orchestration configuration
├── .gitignore
└── README.md
```

## ⚙️ Setup & Usage Guide

### 1. Environment Setup

First, clone the repository and configure your environment variables.

Copy the `.env.example` file to create your active `.env` file:

```bash
cp .env.example .env
```

**Required Root / Backend `.env` Variables:**

```env
# Optional: Add postgres url if not added it will fallback and use sqlite
DATABASE_URL=sqlite:///./wind_data.db

# CORS Allowed Origins (comma-separated)
ALLOWED_ORIGINS=http://localhost:5184,http://localhost:3000,https://laughing-disco-one.vercel.app

# App Settings
DEBUG=true
PORT=8000
```

**Required Frontend `frontend/.env` Variables:**

Create a `.env` file inside the `frontend/` directory:

```env
VITE_API_BASE_URL=http://localhost:8000/api/v1
```

### 2. Run with Docker Compose (Recommended)

The easiest way to run the entire stack locally in isolated containers is with Docker Compose.

**Build and start all services in the background:**

```bash
docker compose up --build -d
```

Once the services are running, access the application:

- **Frontend UI:** http://localhost:5184
- **Backend API:** http://localhost:8000

To stop all services, run:

```bash
docker compose down
```

### 3. Run Locally (Without Docker)

If you prefer to run the services directly on your machine, follow these steps.

#### Backend

Navigate to the backend directory, install the dependencies, and start the development server:

```bash
cd backend
pip install -r requirements.txt
python -m uvicorn src.main:app --reload --port 8000
```

The backend API will be available at http://localhost:8000.

#### Frontend

Open a new terminal and navigate to the frontend directory:

```bash
cd frontend
npm install
npm run dev
```

The frontend will be available at http://localhost:5184.

## 📚 API Documentation

**Base URL:** Dev - `http://localhost:8000` | Prod - [API](https://laughing-disco-5x2b.onrender.com)

| Method | Endpoint                                    | Description                          |
| ------ | ------------------------------------------- | ------------------------------------ |
| `GET`  | `/api/v1/wind/summary`                      | Get monthly wind generation summary  |
| `GET`  | `/api/v1/wind/daily?target_date=YYYY-MM-DD` | Get daily wind generation profile    |
| `GET`  | `/api/v1/wind/health`                       | Check wind generation service health |
| `GET`  | `/health`                                   | Check API health                     |

For detailed request parameters, response schemas, and testing, refer to:

- **Swagger UI:** https://laughing-disco-5x2b.onrender.com/docs
- **ReDoc:** https://laughing-disco-5x2b.onrender.com/redoc
