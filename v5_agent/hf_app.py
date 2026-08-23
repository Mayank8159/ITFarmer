from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from forecast_api import router as forecast_router

app = FastAPI(title="NFH Inference Forecaster")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["POST"],
    allow_headers=["*"],
)
app.include_router(forecast_router)
