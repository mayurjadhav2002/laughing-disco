from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
import logging

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
)

from src.core.config import settings
from src.api.wind_routes import router as wind_router
from src.services.seed import seed_database

logger = logging.getLogger(__name__)

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan context manager for startup and shutdown events."""
    logger.info("Starting database seeding...")
    seed_database()
    logger.info("Database seeding complete.")
    yield

app = FastAPI(
    title="Energy Pred API",
    version="1.0.0",
    lifespan=lifespan,
    debug=settings.DEBUG,   
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(wind_router, prefix=settings.API_VERSION)

@app.get("/health")
def health_check_route() -> dict[str, str]:
    return {"status": "ok"}


