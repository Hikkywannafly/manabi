"""
FastAPI Application Entry Point
"""

from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.routes import router
from app import __version__


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan handler"""
    # Startup
    print(f"🚀 Manabi Processor v{__version__} starting...")
    yield
    # Shutdown
    print("👋 Shutting down...")


app = FastAPI(
    title="Manabi Processor",
    description="AI-powered document processing for Quiz and Flashcard generation",
    version=__version__,
    lifespan=lifespan,
)

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Configure for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API routes
app.include_router(router, prefix="/api/v1")


@app.get("/health")
async def health_check():
    """Health check endpoint for Railway"""
    return {
        "status": "healthy",
        "version": __version__,
    }


@app.get("/")
async def root():
    """Root endpoint"""
    return {
        "name": "Manabi Processor",
        "version": __version__,
        "docs": "/docs",
    }
